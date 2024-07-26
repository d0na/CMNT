// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract AMEventOrganizer {
    function hasPremiumMemberRole(address member) public pure returns (bool) {
        return member == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    }

    function hasLogistiSupportRole(address member) public pure returns (bool) {
        return member == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    }
}
