// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./SmartPolicy.sol";
import "./NMT.sol";

abstract contract MutableAsset {
    address public immutable nmt;
    NMT public immutable nmtContract;

    address public linked;
    string public tokenURI;
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
        nmtContract = NMT(_nmt);
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function setTokenURI(string memory _tokenUri) internal virtual {
        tokenURI = _tokenUri;
    }

    // function getAssetDescriptor() public virtual override {}
    function getHolder() public view returns (address) {
        address owner = nmtContract.ownerOf(uint160(address(this)));
        return owner;
    }

    function setLinked(
        address linkedNmt
    )
        public
        virtual
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature("setLinked(address)", linkedNmt),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature("setLinked(address)", linkedNmt),
            address(this)
        )
    {
        linked = linkedNmt;
    }

    /** Set a new Mutable Asset Owner Smart policy  */
    function setHolderSmartPolicy(
        address _holderSmartPolicy
    ) public virtual onlyOwner {
        holderSmartPolicy = _holderSmartPolicy;
    }

    /**
     * MODIFIERS
     * */

    modifier evaluatedByHolder(
        address _subject,
        bytes memory _action,
        address _resource
    ) {
        require(
            SmartPolicy(holderSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by HOLDER policy"
        );
        _;
    }

    modifier evaluatedByCreator(
        address _subject,
        bytes memory _action,
        address _resource
    ) {
        require(
            SmartPolicy(creatorSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by CREATOR policy"
        );
        _;
    }

    /**
     * @dev Revert the execution if the call is not from the owner
     */
    modifier onlyOwner() {
        require(msg.sender == getHolder(), "Caller is not the holder");
        _;
    }
}
