// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MutableAsset.sol";
import "./SmartPolicy.sol";

abstract contract NMT is Ownable, ERC721Enumerable {
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
    ) public virtual override(ERC721, IERC721) {
        MutableAsset(getMutableAssetAddress(tokenId)).transferFrom(from, to);
        // Call the _update function, problems using super_safeTransfer or others
        super._update(to, tokenId,from);
        // less expensive in terms of gas
        //ERC721.transferFrom(from, to, tokenId);
    }

    function payableTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable {
        console.log("PaybleTrasnferFrom");
        MutableAsset(getMutableAssetAddress(tokenId)).payableTransferFrom(
            from,
            to,
            msg.value
        );
        // Call the _update function, problems using super_safeTransfer or others
        super._update(to, tokenId,from);
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

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721Enumerable) returns (address) {
        super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal virtual override(ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }
}
