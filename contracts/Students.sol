// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract Students {
    struct Student {
        string name;
        uint256 age;
    }

    mapping(uint256 => Student) public students;
    uint256 public curId;

    event Added(string name, uint256 age);
    event Updated(uint id, string name, uint256 age);
    event Removed(uint id);

    constructor() {
        curId = 0;
    }

    // Function to add a new Student to the mapping and increment the counter
    function add(string calldata _name, uint256 _age) public {
        students[curId] = Student(_name, _age);
        curId++;
        emit Added(_name, _age);
    }

    // Function to add a new Student to the mapping and increment the counter
    function update(uint256 _id, string calldata _name, uint256 _age) public {
        students[_id] = Student(_name, _age);
        emit Updated(_id, _name, _age);
    }

    // Function to remove a specific record based on its ID
    function remove(uint256 _id) public {
        // Delete the last element in the mapping
        emit Removed(_id);
    }
}
