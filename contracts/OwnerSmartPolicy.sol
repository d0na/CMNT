// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./JacketMNT.sol";
import "./PolicyInformationPoint.sol";

contract OwnerSmartPolicy {
    /*
            
        Subject : who required the resource
        Resources: the elements which the Subject wants to access
        Action: the action goal of the policy

        Rule: determines rules for each policy, is effect  can be PERMIT/DENY 
        Target: used to check the validity of the action regarding the resource
                It is composed by:
                1. One or more Subjects
                2. An Action - the aciont goal of the policy
                3. The involved resources to protect
            
    */

    mapping(bytes32 => bytes32) private AllowedActions;

    struct User {
        bytes32 userName;
        bool authorized;
    }

    struct Session {
        uint id;
        User users;
    }

    address private admin;
    PolicyInformationPoint private pip;
    uint private id;
    Session[] private register;
    address constant _pip = 0x57A8aAfc40EDCa45F13B4a74009CBAD162e82e23;

    constructor() {
        admin = msg.sender;
        pip = PolicyInformationPoint(_pip);
        id = 0;
        // change_pattern: 0x6368616e67655f7061747465726e
        AllowedActions[
            "0x6368616e67655f7061747465726e"
        ] = "0x6368616e67655f7061747465726e";
        // change_color : 0x6368616e67655f636f6c6f72
        AllowedActions[
            "0x6368616e67655f636f6c6f72"
        ] = "0x6368616e67655f636f6c6f72";
    }

    /***
     * @dev Funzione che verifica se due stringhe sono uguali
     */
    function equal(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
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

    // Condition 1
    function isAuthorizedTailor(address _tailor) private view returns (bool) {
        address[] memory tailors = pip.pubTailorList();
        if (tailors[1] == _tailor) {
            return true;
        }
        return false;
    }

    // Condition 2
    function isAllowedColor(string memory _color) private view returns (bool) {
        string[] memory colors = pip.pubAllowedColorList();
        if (equal(colors[1], _color)) {
            return true;
        }
        return false;
    }

    function evalSetColor(
        address _subject,
        bytes32 _action,
        address _resource,
        string memory _color
    ) public view onlyAllowedAction(_action) returns (bool) {
        return (isAllowedColor(_color) && isAuthorizedTailor(_subject));
    }

    modifier onlyAllowedAction(bytes32 _action) {
        require(
            _action == AllowedActions[_action],
            "Invalid action name invoked for this action"
        );
        _;
    }
}
