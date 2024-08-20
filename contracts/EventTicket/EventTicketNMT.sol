// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/NMT.sol";
import "./EventTicketMutableAsset.sol";

/* @title EventTicket Mutable NFT
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Mutable NFT contract which maintain the association with the EventTicket Asset
 */
contract EventTicketNMT is NMT {
    constructor(
        address to,
        address principalSmartPolicy
    )
        NMT(principalSmartPolicy)
        ERC721("Mutable EventTicket UniPi Project", "TICKETNMT")
        // Ownable(to)
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
        EventTicketMutableAsset eventTicket = new EventTicketMutableAsset(
            address(this),
            address(creatorSmartPolicy),
            address(holderSmartPolicy)
        );

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(eventTicket));
        // console.log("tokenID", tokenId);

        _safeMint(to, tokenId);
        // console.log("asset address:", address(eventTicket));
        // console.log("asset tokenId:", tokenId);
        // console.log("res:", address(eventTicket), tokenId);
        return (address(eventTicket), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // console.log("tokenId",tokenId);
        // _requireMinted(tokenId);

        // Retrieving the contract address of the asset
        address asset_contract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        EventTicketMutableAsset asset = EventTicketMutableAsset(asset_contract);
        return asset.tokenURI();
    }

    function getEventTicketAddress(
        uint256 _tokenId
    ) public pure returns (address) {
        return _intToAddress(_tokenId);
    }
}
