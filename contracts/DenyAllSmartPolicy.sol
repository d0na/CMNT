// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./base/SmartPolicy.sol";
import "./PolicyInformationPoint.sol";

contract DenyAllSmartPolicy is SmartPolicy {
    
    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {    
        // console.log("denyall",address(this)); 
        return false;
    }

    fallback() external {
        //console.log("Fallback OwnerSmartPolicy");
    }
}
