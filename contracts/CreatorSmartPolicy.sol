// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./base/SmartPolicy.sol";
import "./PolicyInformationPoint.sol";

contract CreatorSmartPolicy is SmartPolicy {
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

    bytes4 internal constant ACT_SET_COLOR =
        bytes4(keccak256("setColor(uint256,string)"));

    bytes4 internal constant ACT_TRANSFER_FROM =
        bytes4(keccak256("transferFrom(address,address)"));

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

    // Condition 1
    function _isAuthorizedTailor(address _tailor) private pure returns (bool) {
        // //return equal(_tailor,"mario");
        // address[] memory tailors = pip.pubTailorList();
        // for (uint i = 0; i < tailors.length; i++) {
        //     if (tailors[i] == _tailor) {
        //         return true;
        //     }
        // }
        // return false;
        return
            _tailor == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 || //test account1
            _tailor == 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC || //test account2
            _tailor == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 || // test account0
            _tailor == 0x21387C745c98f092C376151197E68e56E33de81e || // sepolia 1
            _tailor == 0x7DE5260b6964bAE3678f3C7a8c45628af2CeAc28 || // sepolia 2
            _tailor == 0x901D7C8d516a5c97bFeE31a781A1101D10BBc8e9; // sepolia 3
    }

    // Condition 2
    function _isAllowedColor(uint256 _color) private pure returns (bool) {
        // uint256[] memory colors = pip.pubAllowedColorList();
        //     console.log("AAAA");
        // for (uint i = 0; i <= colors.length; i++) {
        //     console.log("XXXXXXX",colors[i] );
        //     if (colors[i] == _color) {
        //         return true;
        //     }        // }
        // return false;
        return _color == 1 || _color == 3 || _color == 5;
    }

    // Condition 3
    // function hasRemoveSleeves() private view returns (bool) {
    //     return pip.pubRemoveSleeves();
    // }

    // // TODO to implent new check that controls if is this action is allowed
    // modifier onlyAllowedAction(bytes32 _action) {
    //     require(
    //         _action == AllowedActions[_action],
    //         "Invalid action name invoked for this action"
    //     );
    //     _;
    // }

    // Evalute if the action is allowed or denied
    // TODO think to add a modifier that check if the action is in some list -> onlyAllowedAction

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        // console.log("Passed action [CREATOR SP]:");
        // console.logBytes(_action);
        bytes4 _signature = this.decodeSignature(_action);
        // Set Color
        if (_signature == ACT_SET_COLOR) {
            // console.log("Action [ACT_SET_COLOR]: ok");
            // retrieves specific params
            uint256 _color = this.getSetColorParam(_action);
            // console.log("Action [ACT_SET_COLOR] - color: %s", _color);
            // console.log("Action [ACT_SET_COLOR] - subject: %s", _subject);
            // console.log("Action [ACT_SET_COLOR] - resource: %s", _resource);

            // perform conditions evaluation (AND | OR)
            return
                _isAllowedColor(_color) &&
                _isAuthorizedTailor(_subject) &&
                _resource == _resource;
        }

        if (_signature == ACT_TRANSFER_FROM) {
            return true;
        }

        return false;
    }

    fallback() external {
        //console.log("Fallback CreatorSmartPolicy");
    }
}
