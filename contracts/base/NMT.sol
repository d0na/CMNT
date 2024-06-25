// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MutableAsset.sol";
import "./SmartPolicy.sol";

abstract contract NMT is Ownable, ERC721 {
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
    ) public virtual override {
        // console.log("transferFrom from %s to %s tokenId %s", from,to,tokenId);
        MutableAsset(getMutableAssetAddress(tokenId)).transferFrom(from, to);

        // more expensive in terms of gas
        super._safeTransfer(from, to, tokenId);
        // less expensive in terms of gas
        //ERC721.transferFrom(from, to, tokenId);
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
}
