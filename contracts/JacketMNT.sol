// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


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
contract JacketMNT is MutableNFT   {

    constructor() ERC721("Mutable Jacket for a PUB Decentraland UniPi Project", "PUBMNTJACKET") {
    }

    function _mint(address to) internal override returns (address,uint){
        //Creo un nuovo asset
        JacketAsset asset = new JacketAsset();

        /* Il proprietario di questo contratto sarà il beneficiario il quale potrà invocare
        tutti i metodi previsti da esso*/
        asset.transferOwnership(to);

        //Determinazione del tokenID e chiamata alla funzione di minting del contratto ERC721
        uint tokenId = uint160(address(asset));
        _safeMint(to, tokenId, "");

        return (address(asset), tokenId);
    }

   function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        
        //Recupero l'indirizzo del contratto
        address asset_contract = _intToAddress(tokenId);

        //Otteniamo dal contratto del cappello l'URI che ne descrive lo stato corrente
        JacketAsset asset = JacketAsset(asset_contract);
        return asset.get3DModel();
    }
}
