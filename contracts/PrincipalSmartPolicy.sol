// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./base/SmartPolicy.sol";
import "./base/MutableAsset.sol";
import "./base/NMT.sol";
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
    bytes4 internal constant ACT_MINT =
        bytes4(keccak256("mint(address,address,address)"));

    // Evalute if the action is allowed or denied
    // TODO think to add a modifier that check if the action is in some list -> onlyAllowedAction

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        // console.log("Passed action [PRINCIPAL SP]:");
        // console.logBytes(_action);
        bytes4 _signature = this.decodeSignature(_action);
        if (_signature == ACT_MINT) {
            uint256 instancesCount = _calcInstancesCount(_resource, _subject);
            
            if (instancesCount <= 3) {
                return true;
            }

            
        }

        return false;
    }

    function _calcInstancesCount(
        address _res,
        address _subj
    ) private view returns (uint256) {
        return NMT(_res).balanceOf(_subj);
    }




    fallback() external {}
}
