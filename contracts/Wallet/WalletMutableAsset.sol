 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/NMT.sol";
import "../base/MutableAsset.sol";

 /* 
 * @title Wallet Mutable Asset
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Wallet Asset rapresentation 
 */
 contract WalletMutableAsset is MutableAsset {
     constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    //Wallet descriptor
    struct WalletDescriptor {
        uint256 trainCompanyRewards;
        uint256 backgroundColor;
        uint256 texture;
        string logo;
        string name;
    }

    // Current state representing Wallet descriptor with its attributes
    WalletDescriptor public walletDescriptor;

    /** Retrieves all the attributes of the descriptor Wallet
     *
     * TODO forse visto che WalletDescriptor è public nn doverebbe servire
     */
    function getWalletDescriptor()
        public
        view
        returns (WalletDescriptor memory)
    {
        return (walletDescriptor);
    }

    event StateChanged(WalletDescriptor walletDescriptor);

    /**
     * USERS ACTIONS with attached policy
     * */

    fallback() external {}

    // function setName(
    //     string _name,
    //     string memory _tokenURI
    // )
    //     public
    //     evaluatedByCreator(
    //         msg.sender,
    //         abi.encodeWithSignature(
    //             "setColor(uint256,string)",
    //             _color,
    //             _tokenURI
    //         ),
    //         address(this)
    //     )
    //     evaluatedByHolder(
    //         msg.sender,
    //         abi.encodeWithSignature(
    //             "setColor(uint256,string)",
    //             _color,
    //             _tokenURI
    //         ),
    //         address(this)
    //     )
    // {
    //     _setName(_name, _tokenURI);
    // }

    // // Public only for evaluating costs
    // function _setName(uint256 _color, string memory _tokenURI) public {
    //     walletDescriptor.color = _color;
    //     setTokenURI(_tokenURI);
    //     emit StateChanged(walletDescriptor);
    // }
 }