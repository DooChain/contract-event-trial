// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract Students {
    struct Student {
        string name;
        uint256 age;
    }

    mapping(uint256 => Student) public students;
    uint256 public curId;

    event Added(uint id, string name, uint256 age);
    event Updated(uint id, string name, uint256 age);
    event Removed(uint id);

    constructor() {
        curId = 1;
    }

    // Function to add a new Student to the mapping and increment the counter
    function add(string calldata _name, uint256 _age) public {
        students[curId] = Student(_name, _age);
        emit Added(curId, _name, _age);
        curId++;
    }

    // Function to add a new Student to the mapping and increment the counter
    function update(uint256 _id, string calldata _name, uint256 _age) public {
        students[_id] = Student(_name, _age);
        emit Updated(_id, _name, _age);
    }

    // Function to remove a specific record based on its ID
    function remove(uint256 _id) public {
        delete students[_id];
        emit Removed(_id);
    }
}
