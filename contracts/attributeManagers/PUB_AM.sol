// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title PUB AM - Pisa University Brand Attribute Manager
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Contains all the information related to PUB
 */
contract PUB_AM {
    using Strings for string;

    string[] private _tailorList;
    string[] private _colorList;

    constructor() {
        _tailorList.push("mario");
        _tailorList.push("pino");
        _colorList.push("red");
        _colorList.push("green");
    }
    // Lista dei sarti autorizzati
    function authorizedTailorList() public view returns (string[] memory) {
        return _tailorList;
    }


    function colorAllowed() public view returns (string[]memory) {
        return _colorList;
    }

}
