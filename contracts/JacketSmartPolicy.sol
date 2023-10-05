// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./interfaces/SmartPolicy.sol";
import "./PolicyInformationPoint.sol";

abstract contract JacketSmartPolicy is SmartPolicy {
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
    //mapping(bytes32 => bytes32) private AllowedActions;
    PolicyInformationPoint private pip;
    address constant _pip = 0x57A8aAfc40EDCa45F13B4a74009CBAD162e82e23;

    bytes4 internal constant ACT_SET_COLOR=bytes4(keccak256("setColor(uint256)")); 

    constructor() {
        pip = PolicyInformationPoint(_pip);
        // change_pattern: 0x6368616e67655f7061747465726e
        // AllowedActions[
        //     "0x6368616e67655f7061747465726e"
        // ] = "0x6368616e67655f7061747465726e";
        // // change_color : 0x6368616e67655f636f6c6f72
        // this.AllowedActions[
        //     "0x6368616e67655f636f6c6f72"
        // ] = "0x6368616e67655f636f6c6f72";
    }

    // is public because if not is not possibile do the trick this.getSetColorParam and bypass the
    // memory and calldata check
    function getSetColorParam(
        bytes calldata _payload
    ) public pure returns (uint256) {
        return abi.decode(_payload[4:], (uint256));
    }

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual returns (bool);
}
