// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./SmartPolicy.sol";
import "./NMT.sol";

abstract contract MutableAsset {
    address public immutable nmt;

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
        nmt = _nmt;
        holderSmartPolicy = _holderSmartPolicy;
        creatorSmartPolicy = _creatorSmartPolicy;
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function setTokenURI(string memory _tokenUri) internal virtual {
        tokenURI = _tokenUri;
    }

    function getHolder() public view returns (address) {
        return NMT(nmt).ownerOf(uint160(address(this)));
    }

    function setLinked(
        address linkedNmt
    )
        public
        virtual
        evaluatedBySmartPolicies(
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
    ) public virtual onlyHolder {
        holderSmartPolicy = _holderSmartPolicy;
    }

    /** Set a new Mutable Asset Owner Smart policy  */
    function setCreatorSmartPolicy(
        address _creatorSmartPolicy
    )
        public
        virtual
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setCreatorSmartPolicy(address)",
                _creatorSmartPolicy
            ),
            address(this)
        )
    {
        creatorSmartPolicy = _creatorSmartPolicy;
    }

    /** regulate the transferFrom method  */
    function transferFrom(
        address from,
        address to
    )
        public
        virtual
        onlyNMT
        evaluatedByCreator(
            from,
            abi.encodeWithSignature("transferFrom(address,address)", from, to),
            address(this)
        )
        returns (bool)
    {
        holderSmartPolicy = 0x0000000000000000000000000000000000000000;
        return true;
    }

    /** regulate the transferFrom method  */
    function payableTransferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        virtual
        onlyNMT
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "payableTransferFrom(address,address,uint256)",
                from,
                to,
                amount
            ),
            address(this)
        )
        returns (
            bool
        )
    {
        holderSmartPolicy = 0x0000000000000000000000000000000000000000;
        return true;
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

    modifier evaluatedBySmartPolicies(
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
        if (holderSmartPolicy == address(0)) {
            _;
        } else {
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
    }

    /**
     * @dev Revert the execution if the call is not from the holder
     */
    modifier onlyHolder() {
        require(msg.sender == getHolder(), "Caller is not the holder");
        _;
    }

    /**
     * @dev Revert the execution if the call is not from the NMT contract
     */
    modifier onlyNMT() {
        require(msg.sender == nmt, "Caller should be NMT");
        _;
    }
}
