 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/NMT.sol";
import "./WalletMutableAsset.sol";

 /* @title Wallet Mutable NFT
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Mutable NFT contract which maintain the association with the Wallet Asset
 */
 contract WalletNMT is NMT {
    constructor(address to)
        ERC721(
            "Mutable Wallet UniPi Project",
            "WALLETMNT"
        )
        Ownable(to)
    {}

    /**
     *
     * @param to  address of the new holder
     */
    function _mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    ) internal override returns (address, uint) {
        // Asset creation by specifying the creator's address and smart Policies (creator and owner)
        WalletMutableAsset wallet = new WalletMutableAsset(
            address(this),
            address(creatorSmartPolicy),
            address(holderSmartPolicy)
        );

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(wallet));
        console.log("tokenID",tokenId);

        _safeMint(to, tokenId);
        console.log("asset address:", address(wallet));
        console.log("asset tokenId:", tokenId);
        console.log("res:",address(wallet), tokenId);
        return (address(wallet), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // console.log("tokenId",tokenId);
        // _requireMinted(tokenId);

        // Retrieving the contract address of the asset
        address asset_contract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        WalletMutableAsset asset = WalletMutableAsset(asset_contract);
        return asset.tokenURI();
    }

    function getWalletAddress(uint256 _tokenId) public pure returns (address) {
        return _intToAddress(_tokenId);
    }
 }