// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./JacketSmartPolicy.sol";

contract OwnerSmartPolicy is JacketSmartPolicy {
    // Condition 1
    function _isAuthorizedTailor(address _tailor) private pure returns (bool) {
        // address[] memory tailors = pip.pubTailorList();
        // if (tailors[1] == _tailor) {
        //     return true;
        // }
        // return false;

        return _tailor == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    }

    // Condition 2
    function _isAllowedColor(uint256 _color) private pure returns (bool) {
        return _color == 1;
    }

    // modifier onlyAllowedAction(bytes32 _action) {
    //     require(
    //         _action == this.AllowedActions[_action],
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
        bytes4 _signature = this.decodeSignature(_action);
        // Set Color
        if (_signature == ACT_SET_COLOR) {
            // retrieves specific params
            uint256 _color = this.getSetColorParam(_action);
            // perform conditions evaluation (AND | OR)
            return
                _isAllowedColor(_color) &&
                _isAuthorizedTailor(_subject) &&
                _subject == _subject;
        } else {
            return false;
        }
    }

    fallback() external {
        //console.log("Fallback OwnerSmartPolicy");
    }
}
