// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableNFT.sol";
import "./JacketAsset.sol";

/**
 * @title Jacket Mutable NFT 
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Mutable NFT contracat which maintain the association with the Jacket Asset 
 */
contract JacketMNT is MutableNFT {
    constructor()
        ERC721(
            "Mutable Jacket for a PUB Decentraland UniPi Project",
            "PUBMNTJACKET"
        )
    {}

    function _mint(address to) internal override returns (address, uint) {
        // Creation of the asset by specifying the creator's address
        JacketAsset jacket = new JacketAsset(to);

        // The asset creator will also be the asset owner who can invoke all methods provided
        jacket.transferOwnership(to);

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(jacket));
        
        _safeMint(to, tokenId, "");
        // console.log("asset address:", address(jacket));
        // console.log("asset tokenId:", tokenId);
        // console.log("res:",address(jacket), tokenId);
        return (address(jacket), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // console.log("tokenId",tokenId);
        _requireMinted(tokenId);
        

        // Retrieving the contract address of the asset
        address asset_contract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        JacketAsset asset = JacketAsset(asset_contract);
        return asset.get3DModel();
    }
}
