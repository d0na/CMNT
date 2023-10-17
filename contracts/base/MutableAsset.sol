// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

abstract contract MutableAsset {
    string public tokenURI;
    address public nmt;
    address public ownerSmartPolicy;
    address public creatorSmartPolicy;

    // CurrentOwner in byte32, TODO: to change asap
    // bytes32 currentOwnerb32 = bytes32(uint256(uint160(address(currentOwner))));

    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _ownerSmartPolicy
    ) {
        require(_nmt == address(_nmt), "Invalid NMT address");
        require(
            _ownerSmartPolicy == address(_ownerSmartPolicy),
            "Invalid ownerSmartPolicy address"
        );
        require(
            _creatorSmartPolicy == address(_creatorSmartPolicy),
            "Invalid creatorSmartPolicy address"
        );
        // console.log("_ownerSmartPolicy", _ownerSmartPolicy);
        // console.log("_creatorSmartPolicy", _creatorSmartPolicy);
        nmt = _nmt;
        ownerSmartPolicy = _ownerSmartPolicy;
        creatorSmartPolicy = _creatorSmartPolicy;
    }

    // struct Attribute {
    //     bool _boolean;
    //     string _string;
    //     address _address;
    //     uint256 _uint;
    // }

    // mapping(bytes32 => Attribute) public assetAttributes;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // event AssetAttributeChanged(Attribute assetAttribute);

    // function _setAssetAttribute(
    //     string memory _key,
    //     Attribute memory _assetAttribute
    // ) internal {
    //     assetAttributes[keccak256(abi.encodePacked(_key))] = _assetAttribute;
    //     emit AssetAttributeChanged(_assetAttribute);
    // }

    // function _getAssetAttribute(
    //     string memory _key
    // ) internal returns (Attribute) {
    //     return assetAttributes[keccak256(abi.encodePacked(_key))];
    // }

    function setTokenURI(string memory _tokenUri) public virtual {
        tokenURI = _tokenUri;
    }

    /** Set a new Mutable Asset Owner Smart policy  */
    function setOwnerSmartPolicy(
        address _ownerSmartPolicy
    ) public virtual onlyOwner {
        ownerSmartPolicy = _ownerSmartPolicy;
    }

    function getOwner() public virtual returns (address);

    function transferOwnership(address to) public virtual {
        require(to == address(to), "Invalid address");
        require(to != address(0), "Ownable: new owner is the zero address");

        address oldOwner = nmt;
        nmt = to;
        emit OwnershipTransferred(oldOwner, nmt);
    }

    /**
     * @dev Interrompe l'esecuzione se la funzione è chiamata da un account che non è proprietario.
     */
    modifier onlyOwner() {
        require(msg.sender == getOwner(), "Caller is not the owner");
        _;
    }


}
