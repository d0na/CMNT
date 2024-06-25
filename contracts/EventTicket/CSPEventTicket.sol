// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";
import "../base/NMT.sol";
import "../base/MutableAsset.sol";

contract CSPEventTicket is SmartPolicy {
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

    bytes4 internal constant ACT_TRANSFER_FROM =
        bytes4(keccak256("transferFrom(address,address)"));
    bytes4 internal constant ACT_PAYBLE_TRANSFER_FROM =
        bytes4(keccak256("payableTransferFrom(address,address,uint256)"));

    constructor() {}

    // is public because if not is not possibile do the trick this.getSetColorParam and bypass the
    // memory and calldata check
    function getSetColorParam(
        bytes calldata _payload
    ) public pure returns (uint256) {
        return abi.decode(_payload[4:], (uint256));
    }

    function getTransferFromParam(
        bytes calldata _payload
    ) public pure returns (address, address) {
        return abi.decode(_payload[4:], (address, address));
    }

    function getPayableTransferFromParam(
        bytes calldata _payload
    ) public pure returns (address, address, uint256) {
        return abi.decode(_payload[4:], (address, address, uint256));
    }

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        // console.log("Passed action [CREATOR SP]:");
        // console.logBytes(_action);
        bytes4 _signature = this.decodeSignature(_action);
        if (_signature == ACT_PAYBLE_TRANSFER_FROM) {
            (address from, address to, uint256 amount) = this
                .getPayableTransferFromParam(_action);
           
            if (amount >= 101) {
                return false;
            }

            return true;
        }

        if (_signature == ACT_TRANSFER_FROM) {
            (address from, address to) = this.getTransferFromParam(_action);
            return _calcInstancesCount(_resource, to) <= 3;
        }

        return false;
    }

    function _calcInstancesCount(
        address _res,
        address _subj
    ) private view returns (uint256) {
        return MutableAsset(_res).nmtContract().balanceOf(_subj);
    }

    fallback() external {
        //console.log("Fallback CreatorSmartPolicy");
    }
}
