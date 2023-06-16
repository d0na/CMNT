// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

contract PIPInterface {
    function envIsTailorAuthorized(string memory _tailor) public pure returns (bool) {}

    function envIsColorAllowed(string memory _color) public pure returns (bool) {}
}

contract PolicyDecisionPoint {
    struct User {
        bytes32 userName;
        bool authorized;
    }

    struct Session {
        uint id;
        User users;
    }

    address private admin;
    PIPInterface private PIPcontr;
    uint private id;
    Session[] private register;

    constructor(address pipAddr) {
        admin = msg.sender;
        PIPcontr = PIPInterface(pipAddr);
        id = 0;
    }

    function getSessionById(uint _id) public view returns (bytes32, bool) {
        if (_id >= register.length) {
            revert();
        }

        return (register[_id].users.userName, register[_id].users.authorized);
    }

    function getPermission(bytes32 subject) public returns (uint) {
        if (msg.sender != admin) {
            revert();
        }

        // bool outcome = globalRule();
        bool outcome = true;
        User memory u = User(subject, outcome);
        Session memory s = Session(id, u);

        id++;
        register.push(s);
        return (id - 1);
    }

    function rule1(string memory _color) private view returns (bool) {
        return PIPcontr.envIsColorAllowed(_color);
    }

    function rule2(string memory _tailor) private view returns (bool) {
        return PIPcontr.envIsTailorAuthorized(_tailor);
    }


    // function globalRule(bytes32 subject) private view returns (bool) {
    function globalRule(string memory _color, string memory _tailor) public view returns (bool) {
        return
            (rule1(_color) && rule2(_tailor));
    }
}
