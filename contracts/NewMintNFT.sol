// SPDX-License-Identifier: MIT
// This is just a test NFT collections that helps decentralized Finance, NFT Finance, Social Finance and others kind Dapps building on testnet.

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// This is just a test NFT collections that helps decentralized Finance, NFT Finance, Social Finance and others kind Dapps building on testnet.
contract NewMintNFT is ERC721, Ownable {
    bytes32 public rootHash =
        0x9f8f5a2556959716e288f3c87b99bdd6f65d5e325e75592494d867b245db523a;
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    string public uriPrefix =
        "ipfs://Qma6Ch3QXuPt9QXiTY7aRsBjb2g53kgnH5zwwS2g7Mi73s/";
    string public uriSuffix = ".json";

    uint256 public mintCost = 0.0001 ether;
    uint256 public maxSupply = 70;
    uint256 public maxMintAmountPerTx = 5;
    uint256 mintLimit = 10;
    mapping(address => uint256) public mintCount;

    event NewNFTMinted(address sender, uint256 tokenId, uint256 mintCount);

    constructor() ERC721("NewMintNFT", "NMN") {}

    function isValidProof(
        bytes32[] calldata proof,
        bytes32 leaf
    ) private view returns (bool) {
        return MerkleProof.verify(proof, rootHash, leaf);
    }

    function isWhiteListed(
        bytes32[] calldata proof
    ) public view returns (bool) {
        return isValidProof(proof, keccak256(abi.encodePacked(msg.sender)));
    }

    modifier mintRequire(uint256 _mintAmount) {
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
            "Invalid mint amount! Should be less than 5"
        );
        require(
            supply.current() + _mintAmount <= maxSupply,
            "Max supply exceeded! Should be less than 70"
        );
        _;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mint(
        uint256 _mintAmount,
        bytes32[] calldata proof
    ) public payable mintRequire(_mintAmount) {
        bool whiteListed = isWhiteListed(proof);
        require(
            msg.value >= (whiteListed ? 0 : mintCost) * _mintAmount,
            "Insufficient funds!"
        );
        require(
            mintCount[msg.sender] + _mintAmount <= mintLimit,
            "public mint limit exceeded. Should be less than 10"
        );

        _mintLoop(msg.sender, _mintAmount);
        mintCount[msg.sender] += _mintAmount;
        emit NewNFTMinted(
            msg.sender,
            uint256(supply.current()),
            mintCount[msg.sender]
        );
    }

    function getmintCount() public view returns (uint256) {
        return mintCount[msg.sender];
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;
                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        uint256(_tokenId + 1).toString(),
                        uriSuffix
                    )
                )
                : "";
    }

    function withdraw() public onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function _mintLoop(address _receiver, uint256 _mintAmount) internal {
        for (uint256 i = 0; i < _mintAmount; i++) {
            _safeMint(_receiver, supply.current());
            supply.increment();
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uriPrefix;
    }

    function saveWhiteList(bytes32 _rootHash) public {
        rootHash = _rootHash;
    }
}
// This is just a test NFT collections that helps decentralized Finance, NFT Finance, Social Finance and others kind Dapps building on testnet.
