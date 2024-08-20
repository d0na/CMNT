// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// https://medium.com/51nodes/why-upgrading-openzeppelin-smart-contracts-from-version-4-to-version-5-is-unsafe-e08be30efd8a

contract MyTokenERC721Enumerable is  ERC721Enumerable, Ownable {
    constructor(address to) ERC721("MyNFT", "MNFT") Ownable(to) {}


    // Allows minting of a new NFT
    function mintCollectionNFT(
        address collector,
        uint256 tokenId
    ) public onlyOwner {
        _mint(collector, tokenId);
    }
}
