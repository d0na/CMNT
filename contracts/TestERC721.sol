// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "./JacketNMT.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/** Test purpose smart contract  */

contract TestERC271 {

    // try a transferFrom using jacketNMT
    function securedTransferFrom(
        address _nmt,
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        JacketNMT jacketNMT = JacketNMT(_nmt);
        console.log("jakcetNMT %s", address(jacketNMT));
        jacketNMT.transferFrom(_from, _to, _tokenId);
    }

    // try a transferFrom using jacketNMT by casting to ERC721
    function castedTransferFrom(
        address _nmt,
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        ERC721 castedNMT = ERC721(_nmt);
        console.log("jakcetNMT %s", address(castedNMT));
        castedNMT.transferFrom(_from, _to, _tokenId);
    }
}
