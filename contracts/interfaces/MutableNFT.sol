// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract MutableNFT is Ownable,ERC721  {

    /**
     * @notice mint
     */
    function mint(address to) public onlyOwner returns (address, uint) {
        require(to == address(to), "Invalid address");
        return __mintFunction__(to);
    }

    /**
     * 
     * @dev function tha should be ovveriden. In this way the real mint function works with the applied modifier
     * https://ethereum.stackexchange.com/questions/52960/do-modifiers-work-in-interfaces
     */
    function __mintFunction__(address to) internal virtual returns (address, uint);
}
