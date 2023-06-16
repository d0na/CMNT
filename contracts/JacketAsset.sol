// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableAsset.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PolicyDecisionPoint.sol";

/**
 * @title Smart Asset which represents a Jacket
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Jacket properties and features which allows
 * it to mutate
 */
contract JacketAsset is MutableAsset {

    using Strings for string;
    // CurrentOwner in byte32, TODO: to change asap
    bytes32 currentOwnerb32 = bytes32(uint256(uint160(address(currentOwner))));
    address _pip;
    PolicyDecisionPoint pdpChangeColor = new PolicyDecisionPoint(address(currentOwner));
    
    string color;

    constructor(address _owner) {
        require(_owner == address(_owner), "Invalid owner address");
        currentOwner = _owner;
    }

    /**
     * @dev Example
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

    /**
     * @notice Let change the jacket color
     */
    function changeColor(string memory _color, string memory _tailor) isColorChangeable(_color,_tailor) public {
        color = _color;
    }

    // PEP - functions which return decisions from pdp

    // soggetto, azione , risorsa e altri parametri
    modifier isColorChangeable(string memory _color, string memory _tailor) {
        require(pdpChangeColor.globalRule(_color,_tailor) == true, "Change Color operation is not allowed");
        _;
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
