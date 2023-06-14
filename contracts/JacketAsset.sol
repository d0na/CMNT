// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableAsset.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Smart Asset which represents a Jacket
 * @author Francesco Donini
 * @notice This Smart Contract contains all the Jacket properties and features which allows
 * it to mutate
 */
contract JacketAsset is MutableAsset {
    using Strings for string;

    constructor(address owner) {
        require(owner == address(owner), "Invalid owner address");
        currentOwner = owner;
    }

    /**
     * @dev Interrompe l'esecuzione se la funzione è chiamata da un account diverso dal contratto
     * di gestione esami dell'università.
     */
    modifier otherModifier() {
        _;
    }

    function transferOwnership(address to) public override otherModifier {
        // In questo modo richiamo trnasferOwnerShip del derivato ma aggiungo
        // quello che pensi giusto ad esempio aggiungere uno o più modifer
        // onlyOwner e otherModifier
        super.transferOwnership(to);
    }

    // // https://www.google.com/search?q=pattern+clothes+anmes&oq=pattern+clothes+anmes&aqs=chrome..69i57j0i22i30j0i8i10i13i15i30.6999j1j7&sourceid=chrome&ie=UTF-8#imgrc=mZSD24o1hA8VdM
    // enum _PATTERN {
    //     STRIPPED,
    //     PLAIN,
    //     CHECKED
    // }
    // enum _COLOR {
    //     RED,
    //     GREEN,
    //     BLUE,
    //     YELLOW,
    //     GRAY
    // }

    // /**
    //  * @notice Asset Properties describing how can change the asset
    //  * color: base color used with pattern
    //  * pattern: ..
    //  */
    // struct AssetProperties {
    //     _COLOR color;
    //     _PATTERN pattern;
    // }

    // // function render() external view override returns (uint) {}

    // // function get3DModel() external view override {}

    // // function init() external view override {}
}
