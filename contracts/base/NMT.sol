// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SmartPolicy.sol";
import "./MutableAsset.sol";

abstract contract NMT is Ownable, ERC721 {
    /**
     * @notice mint
     */
    function mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    ) public onlyOwner returns (address, uint) {
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

    function getMutableAssetAddress(uint256 _tokenId) public pure returns (address) {
        return _intToAddress(_tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override evaluatedByCreator(to,abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                MutableAsset(getMutableAssetAddress(tokenId)).creatorSmartPolicy()),to,tokenId){
    }

    modifier evaluatedByCreator(
        address _subject,
        bytes memory _action,
        address _resource,
        uint256 _tokenId
    ) {
        require(
            SmartPolicy(MutableAsset(getMutableAssetAddress(_tokenId)).creatorSmartPolicy()).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by CREATOR policy"
        );
        _;
    }
    // function burn(uint256 tokenId) public {
    //     _burn(tokenId);
    // }
}
