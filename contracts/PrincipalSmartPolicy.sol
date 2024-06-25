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
            return _isAuthorizedRetailer(_subject);
        }

        return false;
    }

    // Condition 1
    function _isAuthorizedRetailer(address _retailer) private pure returns (bool) {
        // //return equal(_tailor,"mario");
        // address[] memory tailors = pip.pubTailorList();
        // for (uint i = 0; i < tailors.length; i++) {
        //     if (tailors[i] == _tailor) {
        //         return true;
        //     }
        // }
        // return false;
        return
            // _retailer == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
            // _tailor == 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC || //test account2
            _retailer == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // test account0
            // _tailor == 0x21387C745c98f092C376151197E68e56E33de81e || // sepolia 1
            // _tailor == 0x7DE5260b6964bAE3678f3C7a8c45628af2CeAc28 || // sepolia 2
            // _tailor == 0x901D7C8d516a5c97bFeE31a781A1101D10BBc8e9; // sepolia 3
    }

    fallback() external {}
}
