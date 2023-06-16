// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

/**
 * @title PUB AM - Pisa University Brand Attribute Manager
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Contains all the information related to PUB
 */
contract PUB_AM {
    function tailorIsAuthorized(
        string memory tailorName
    ) public pure returns (bool) {
        return
            keccak256(abi.encodePacked(tailorName)) ==
            keccak256(abi.encodePacked("mario"));
    }

    function isColorAllowed(string memory color
    ) public pure returns (bool) {
        return
            keccak256(abi.encodePacked(color)) ==
            keccak256(abi.encodePacked("red"));
    }
}
