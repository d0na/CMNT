// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

abstract contract MutableAsset {
    string public tokenURI;
    address public nmt;
    address public holderSmartPolicy;
    address public creatorSmartPolicy;

    // CurrentOwner in byte32, TODO: to change asap
    // bytes32 currentOwnerb32 = bytes32(uint256(uint160(address(currentOwner))));

    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) {
        require(_nmt == address(_nmt), "Invalid NMT address");
        require(
            _holderSmartPolicy == address(_holderSmartPolicy),
            "Invalid holderSmartPolicy address"
        );
        require(
            _creatorSmartPolicy == address(_creatorSmartPolicy),
            "Invalid creatorSmartPolicy address"
        );
        // console.log("_holderSmartPolicy", _holderSmartPolicy);
        // console.log("_creatorSmartPolicy", _creatorSmartPolicy);
        nmt = _nmt;
        holderSmartPolicy = _holderSmartPolicy;
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
    function setHolderSmartPolicy(
        address _holderSmartPolicy
    ) public virtual onlyOwner {
        holderSmartPolicy = _holderSmartPolicy;
    }

    function getHolder() public virtual returns (address);

    function transferOwnership(address to) public virtual {
        require(to == address(to), "Invalid address");
        require(to != address(0), "Ownable: new holder is the zero address");

        address oldOwner = nmt;
        nmt = to;
        emit OwnershipTransferred(oldOwner, nmt);
    }

    /**
     * @dev Interrompe l'esecuzione se la funzione è chiamata da un account che non è proprietario.
     */
    modifier onlyOwner() {
        require(msg.sender == getHolder(), "Caller is not the holder");
        _;
    }


}
