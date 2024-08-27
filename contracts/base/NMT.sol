// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MutableAsset.sol";
import "./SmartPolicy.sol";

abstract contract NMT is ERC721Enumerable {
    address public principalSmartPolicy;

    constructor(address _principalSmartPolicy) {
        principalSmartPolicy = _principalSmartPolicy;
    }

    /**
     * @notice mint
     */
    function mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    )
        public
        // onlyOwner
        evaluatedByPrincipal(
            msg.sender,
            abi.encodeWithSignature(
                "mint(address,address,address)",
                to,
                creatorSmartPolicy,
                holderSmartPolicy
            ),
            address(this)
        )
        returns (address, uint)
    {
        // console.log("Miner", to);
        require(to == address(to), "Invalid address");
        return _mint(to, creatorSmartPolicy, holderSmartPolicy);
    }

    /**
     *
     * @dev function tha should be ovveriden. In this way the real mint function works with the applied modifier
     * https://ethereum.stackexchange.com/questions/52960/do-modifiers-work-in-interfaces
     */
    function _mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    ) internal virtual returns (address, uint);

    function _intToAddress(uint index) internal pure returns (address) {
        return address(uint160(index));
    }

    function _addressToInt(address index) internal pure returns (uint) {
        return uint160(address(index));
    }

    function getMutableAssetAddress(
        uint256 _tokenId
    ) public pure returns (address) {
        return _intToAddress(_tokenId);
    }

    function setPrincipalSmartPolicy(
        address smartPolicyAddress
    )
        public
        virtual
        evaluatedByPrincipal(
            msg.sender,
            abi.encodeWithSignature(
                "setPrincipal(address)",
                smartPolicyAddress
            ),
            address(this)
        )
    {
        principalSmartPolicy = smartPolicyAddress;
    }

    //-----Override delle funzioni previste dallo standard per il trasferimento dei token-----
    // onlyowner
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
        virtual
        override(ERC721, IERC721)
        _transferFromEvaluation(from, to, tokenId)
    {
        (
            bool setHolderSPResult,
            bytes memory returndata2
        ) = getMutableAssetAddress(tokenId).delegatecall(
                abi.encodeWithSignature(
                    "setHolderSmartPolicy(address)",
                    0x0000000000000000000000000000000000000000
                )
            );
        console.log(
            "NMT setHolderSmartPolicy -  result: %s ",
            setHolderSPResult
        );
        require(setHolderSPResult, "Delegate setHolderSmartPolicy call failed");

        // if the function call reverted
        // if (setHolderSPResult == false) {
        //     // if there is a return reason string
        //     if (returndata2.length > 0) {
        //         // bubble up any reason for revert
        //         assembly {
        //             let returndata2_size := mload(returndata2)
        //             revert(add(32, returndata2), returndata2_size)
        //         }
        //     } else {
        //         revert("Function call reverted");
        //     }
        // }
        //         MutableAsset(getMutableAssetAddress(tokenId)).setHolderSmartPolicy(
        //     0x0000000000000000000000000000000000000000
        // );
        // // enforce the transfForm policy located in the Creato Smart Policy linked in the mutable asset
        // MutableAsset(getMutableAssetAddress(tokenId)).transferFrom(from, to);
        // // set the default 0 address after the transfer from to

        super.transferFrom(from, to, tokenId);
        console.log("TrasnferFrom exexcuted");
    }

    //safeTransferFrom(from, to, tokenId, data)

    function payableTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable {
        MutableAsset(getMutableAssetAddress(tokenId)).payableTransferFrom(
            from,
            to,
            msg.value
        );
        super.transferFrom(from, to, tokenId);
        // Optional: Transfer the fee
        payable(from).transfer(msg.value); // send the ETH to the seller
    }

    /** MODIFIERs */
    modifier evaluatedByPrincipal(
        address _subject,
        bytes memory _action,
        address _resource
    ) {
        require(
            SmartPolicy(principalSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by PRINCIPAL policy"
        );
        _;
    }

    // modifier _onlyOwner(tokenId) {
    //     require(msg.sender == this.ownerOf(tokenId);, "Caller is not the holder");
    //     _;
    // }

    modifier _transferFromEvaluation(
        address from,
        address to,
        uint256 tokenId
    ) {
        require(MutableAsset(getMutableAssetAddress(tokenId)).transferFrom(from, to), "TransferFrom evaluation failed");
        _;
    }
}
