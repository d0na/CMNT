// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./JacketMNT.sol";

contract SmartPolicy {
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

    /*

        change_pattern: 0x6368616e67655f7061747465726e
    */

    mapping(bytes32 => bool) private AllowedActions;

    constructor() {
        // change_pattern: 0x6368616e67655f7061747465726e
        AllowedActions["0x6368616e67655f7061747465726e"] = true;
        // change_color : 0x6368616e67655f636f6c6f72
        AllowedActions["0x6368616e67655f636f6c6f72"] = true;
    }

    modifier onlyAllowedActions(bytes32 _action) {
        require(AllowedActions[_action], "Action not allowed");
        _;
    }

    modifier onlyAuthorizedSubject(address _subject, address _resource) {
        JacketMNT nmt = JacketMNT(_resource);
        require(_resource == address(_resource), "Invalid Resource address");
        require(_subject == address(_subject), "Invalid Subject address");
        require(nmt.owner() == _subject, "Subject not allowed");
        _;
    }







    function evalChangeColor(
        address _subject,
        bytes32 _action,
        address _resource,
        bytes32 _color,
        bytes32 _tailor
    ) public onlyAllowedActions(_action) onlyAuthorizedSubject(_subject, _resource) {}

    function evalChangePattern(
        address _subject,
        bytes32 _action,
        address _resource,
        bytes32 _pattern,
        bytes32 _tailor
    ) public onlyAllowedActions(_action) onlyAuthorizedSubject(_subject, _resource) {}
}

/**** SPUNTO */
// //https://ethereum.stackexchange.com/questions/68529/solidity-modifiers-in-library

// contract Pdp {
//     modifier rightSubject (address _subject) {
//         require (_subject != address(0) );
//         _;
//     }

//     function isAuthorizedTaiolr (string memory _tailor) public rightSubject (msg.sender) returns (bool) {
//         // Complicated logic here
//     }
// }

// contract Bar {
//     modifier evaluate (uint x) {
//         require (Pdp.isPrime (x));
//         _;
//     }
// }

// contract Zoo is Bar {
//     function fooBar (uint x) public onlyPrime (x) {
//         // Here we know that x is prime!
//     }
// }
