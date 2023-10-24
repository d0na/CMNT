// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract NMT is Ownable, ERC721 {
    /**
     * @notice mint
     */
    function mint(
        address to,
        address creatorSmartPolicy
    ) public onlyOwner returns (address, uint) {
        // console.log("Miner", to);
        require(to == address(to), "Invalid address");
        return _mint(to, creatorSmartPolicy);
    }

    /**
     *
     * @dev function tha should be ovveriden. In this way the real mint function works with the applied modifier
     * https://ethereum.stackexchange.com/questions/52960/do-modifiers-work-in-interfaces
     */
    function _mint(
        address to,
        address creatorSmartPolicy
    ) internal virtual returns (address, uint);

    function _intToAddress(uint index) internal pure returns (address) {
        return address(uint160(index));
    }

    function _addressToInt(address index) internal pure returns (uint) {
        return uint160(address(index));
    }
}
