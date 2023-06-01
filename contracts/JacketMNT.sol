// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/**
 * @title
 * @author
 * @notice
 * Jacket Mutable NFT which maintain the association with the Jacket Asset
 */
abstract contract JacketMNT is ERC721, Ownable {
    constructor() {
        console.log("built");
    }
}
