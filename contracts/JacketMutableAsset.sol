// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./base/MutableAsset.sol";
import "./JacketNMT.sol";
import "./base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a Jacket
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Jacket properties and features which allows
 * it to mutate
 */
contract JacketMutableAsset is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {
        jacketNmt = JacketNMT(_nmt);
    }

    //Jacket descriptor
    struct JacketDescriptor {
        uint256 color;
        bool sleeves;
    }

    // Current state representing jacket descriptor with its attributes
    JacketDescriptor public jacketDescriptor;
    JacketNMT jacketNmt;

    /** Retrieves all the attributes of the descriptor Jacket
     *
     * TODO forse visto che jacketDescriptor è public nn doverebbe servire
     */
    function getJacketDescriptor()
        public
        view
        returns (JacketDescriptor memory)
    {
        return (jacketDescriptor);
    }

    event StateChanged(JacketDescriptor jacketDescriptor);

   
    /**
     * USERS ACTIONS with attached policy
     * */

    // function setRemoveSleeves(bool _removeSleeves) public {
    //     jacketDescriptor.removeSleeves = _removeSleeves;
    //     emit StateChanged(jacketDescriptor);
    // }

    fallback() external {}

    function setColor(
        uint256 _color
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature("setColor(uint256)", _color),
            address(this)
        )
        evaluatedByHolder(
            msg.sender,
            abi.encodeWithSignature("setColor(uint256)", _color),
            address(this)
        )
    {
        setColorNotEvaluated(_color);
    }

    function setColorNotEvaluated(uint256 _color) public {
        jacketDescriptor.color = _color;
        emit StateChanged(jacketDescriptor);
    }

    

    // function getAssetDescriptor() public virtual override {}
    function getHolder() public virtual override returns (address) {
        address owner = jacketNmt.ownerOf(uint160(address(this)));
        return owner;
    }

    function getNMT() public view returns (address) {
        return address(jacketNmt);
    }
}
