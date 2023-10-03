// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title PUB AM - Pisa University Brand Attribute Manager
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Contains all the information related to PUB
 */
contract PubAM {
    using Strings for string;

    address[] private _tailorList;
    string[] private _colorList;
    bool private _removeSleeves = true;

    constructor() {
        _tailorList.push(0x21387C745c98f092C376151197E68e56E33de81e);
        _tailorList.push(0x7DE5260b6964bAE3678f3C7a8c45628af2CeAc28);
        _colorList.push("red");
        _colorList.push("green");
    }

    // Lista dei sarti autorizzati
    function authorizedTailorList() public view returns (address[] memory) {
        return _tailorList;
    }


    function allowedColorList() public view returns (string[] memory) {
        return _colorList;
    }

    function removeSleeves() public view returns (bool) {
        return _removeSleeves;
    }

}
