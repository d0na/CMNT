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

    address constant _pip = 0x57A8aAfc40EDCa45F13B4a74009CBAD162e82e23;
    string constant defaultJacket = "defaultJacket";
    string constant greenJacket = "greenJacket";
    string constant redJacket = "redJacket";

    // CurrentOwner in byte32, TODO: to change asap
    bytes32 currentOwnerb32 = bytes32(uint256(uint160(address(currentOwner))));
    PolicyDecisionPoint pdp = new PolicyDecisionPoint(_pip);

    //Jacket Properties
    string color;

    event ChangedColor(string color);
    event StateChanged(string color);

    constructor(address _currentOwner) {
        require(
            _currentOwner == address(_currentOwner),
            "Invalid current owner address"
        );
        currentOwner = _currentOwner;
        model3d = defaultJacket;
        console.log("model3d", model3d);
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
    function changeColor(
        string memory _color,
        string memory _tailor
    )
        public
        pepIsColorChangeable(
            currentOwner,
            "0x6368616e67655f636f6c6f72",
            address(0),
            _color,
            _tailor
        )
    {
        emit ChangedColor(_color);
        color = _color;
        _updateState();
    }

    // PEP - functions which return decisions from pdp

    modifier pepIsColorChangeable(
        address _subject,
        bytes32 _action,
        address _resource,
        string memory _color,
        string memory _tailor
    ) {
        require(
            pdp.evalChangeColor(
                _subject,
                _action,
                _resource,
                _color,
                _tailor
            ) == true,
            "Change Color operation DENY"
        );
        _;
    }

    /**
     * Should contains the logic to change internale state by reflecting changing in the model3d variables
     */
    function _updateState() internal {
        if (compare(color, "green")) {
            model3d = greenJacket;
            emit StateChanged(color);
        }

        if (compare(color, "red")) {
            model3d = redJacket;
            emit StateChanged(color);
        }
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
