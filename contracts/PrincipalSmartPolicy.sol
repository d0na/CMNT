// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./base/SmartPolicy.sol";
import "./PolicyInformationPoint.sol";

contract PrincipalSmartPolicy is SmartPolicy {
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

    bytes4 internal constant ACT_MINT =
        bytes4(keccak256("mint(address,address,address)"));

    
    // Evalute if the action is allowed or denied
    // TODO think to add a modifier that check if the action is in some list -> onlyAllowedAction

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public virtual override returns (bool) {
        console.log("Passed action [PRINCIPAL SP]:");
        console.logBytes(_action);
        bytes4 _signature = this.decodeSignature(_action);
        // Set Color
        if (_signature == ACT_MINT) {
            return false;
        } else {
            return false;
        }
    }

    fallback() external {
        //console.log("Fallback CreatorSmartPolicy");
    }
}
