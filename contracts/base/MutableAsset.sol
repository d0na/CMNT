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
        // console.log("_holderSmartPolicy", _holderSmartPolicy);
        // console.log("_creatorSmartPolicy", _creatorSmartPolicy);
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

    // function getAssetDescriptor() public virtual override {}
    function getHolder() public view returns (address) {
        console.log("getHolder: %s", address(this));
        console.log(
            "getHolder: res %s",
            NMT(nmt).ownerOf(uint160(address(this)))
        );
        console.log("getHolder: nmtcontract %s", nmt);

        return NMT(nmt).ownerOf(uint160(address(this)));
    }

    function delegateGetHolder() public returns (address) {
        console.log("into delegatGetHolder: %s",address(this));
        console.log("into delegatGetHolder, nmt: %s",nmt);
        (bool success, bytes memory returnedData) = nmt.delegatecall(
            abi.encodeWithSignature("ownerOf(uint256)", uint160(address(this)))
        );
                console.log("into delegatGetHolder, success: %s",success);

        require(success, "Reverted getHolder");
        return abi.decode(returnedData, (address));
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

    /** Set a new Mutable Asset Owner Smart policy  */
    function setCreatorSmartPolicy(
        address _creatorSmartPolicy
    )
        public
        virtual
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setCreatorSmartPolicy(address)",
                _creatorSmartPolicy
            ),
            address(this)
        )
        evaluatedByHolder(
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
        evaluatedByCreator(
            from,
            abi.encodeWithSignature("transferFrom(address,address)", from, to),
            address(this)
        )
        returns (bool)
    {
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
            // consider also  the holder Smart Policy
            // evaluatedByHolder(
            //     msg.sender,
            //     abi.encodeWithSignature(
            //         "transferFrom(address,address)",
            //         from,to
            //     ),
            //     address(this)
            //)
            bool
        )
    {
        // ERC721(nmt).transferFrom(from,to,uint160(address(address(this))));
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
        console.log(
            "evaluatedByCreator - creatorSmartPolicy: %s",
            creatorSmartPolicy
        );
        console.log(
            "evaluatedByCreator - holderSmartPolicy: %s",
            holderSmartPolicy
        );
        console.log("evaluatedByCreator - _subject: %s", _subject);
        console.log("evaluatedByCreator - _resource: %s", _resource);
        console.log("evaluatedByCreator - mutable asset: %s", address(this));
        require(
            SmartPolicy(creatorSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by CREATOR policy"
        );
        console.log("evaluatedByCreator DONE");
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
        if (holderSmartPolicy == 0x0000000000000000000000000000000000000000) {
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
     * @dev Revert the execution if the call is not from the owner
     */
    modifier onlyOwner() {
        console.log("onlyOwner msg.sender", msg.sender);
        console.log("delegateGetHolder", delegateGetHolder());
        require(msg.sender == delegateGetHolder(), "Caller is not the holder");
        console.log("only owner ok");
        _;
    }
}
