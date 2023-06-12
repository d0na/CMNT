// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableNFT.sol";
import "./JacketAsset.sol";

/**
 * @title
 * @author
 * @notice
 * Jacket Mutable NFT which maintain the association with the Jacket Asset
 */
abstract contract JacketMNT is MutableNFT   {

    function __mintFunction__(address to) internal override returns (address,uint){
        //Creo un nuovo asset passando l'indirizzo di questo contratto come manager.
        JacketAsset asset = new JacketAsset();

        /* Il proprietario di questo contratto sarà il beneficiario il quale potrà invocare
        tutti i metodi previsti da esso*/
        asset.transferOwnership(to);

        //Determinazione del tokenID e chiamata alla funzione di minting del contratto ERC721
        uint tokenId = uint160(address(asset));
        _safeMint(to, tokenId, "");

        return (address(asset), tokenId);
    }
}
