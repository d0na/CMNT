// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableNFT.sol";
import "./JacketAsset.sol";
import "./OwnerSmartPolicy.sol";

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

    /**
     *
     * @param to  address of the new owner
     */
    function _mint(address to) internal override returns (address, uint) {
        // Creation of the asset by specifying the creator's address
        JacketAsset jacket = new JacketAsset(
            to,
            address(new OwnerSmartPolicy())
        );

        // The asset creator will also be the asset owner who can invoke all methods provided
        jacket.transferOwnership(to);

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(jacket));
        // console.log("tokenID",tokenId);

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
        return asset.tokenURI();
    }

    function getJacketAddress(uint256 _tokenId) public pure returns (address) {
        return _intToAddress(_tokenId);
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal {
        JacketAsset asset = JacketAsset(_intToAddress(tokenId));
        // console.log("_transferFrom addr:",address(asset));
        asset.transferOwnership(to);
        // Ownable.transferOwnership(to);
        ERC721.transferFrom(from, to, tokenId);
    }

    //-----Override delle funzioni previste dallo standard per il trasferimento dei token-----
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _transferFrom(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        // console.log("transferFrom");
        _transferFrom(from, to, tokenId);
    }
}
