// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./interfaces/MutableAsset.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./CreatorSmartPolicy.sol";
import "./OwnerSmartPolicy.sol";

/**
 * @title Smart Asset which represents a Jacket
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Jacket properties and features which allows
 * it to mutate
 */
contract JacketAsset is MutableAsset {
    /** */
    constructor(
        address _owner,
        address _ownerSmartPolicy
    )
        MutableAsset(
            _owner,
            address(new CreatorSmartPolicy()),
            _ownerSmartPolicy
        )
    {
        // console.log("_ownerSmartPolicy address",_ownerSmartPolicy);
    }

    using Strings for string;

    //Jacket descriptor
    struct JacketDescriptor {
        uint256 color;
        bool removeSleeves;
    }

    // Current state representing jacket descriptor with its attributes
    JacketDescriptor public jacketDescriptor;

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

    // constructor(
    //     address _currentOwner,
    //     address _ownerSmartPolicy
    // )
    //     MutableAsset(
    //         _currentOwner,
    //         address(new CreatorSmartPolicy()),
    //         _ownerSmartPolicy
    //     )
    // {
    //     require(
    //         _currentOwner == address(_currentOwner),
    //         "Invalid current owner address"
    //     );
    // }

    /**
     * USERS ACTIONS with attached policy
     * */

         // function setRemoveSleeves(bool _removeSleeves) public {
    //     jacketDescriptor.removeSleeves = _removeSleeves;
    //     emit StateChanged(jacketDescriptor);
    // }

    fallback() external {  }

    function setColor(
        uint256 _color
    )
        public
        evaluatedByOwner(
            msg.sender,
            abi.encodeWithSignature("setColor(uint256)", _color),
            address(this)
        )
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature("setColor(uint256)", _color),
            address(this)
        )
    {
        jacketDescriptor.color = _color;
        emit StateChanged(jacketDescriptor);
    }

    function setColorNotEvaluated(
        uint256 _color
    )
        public
    {
        jacketDescriptor.color = _color;
        emit StateChanged(jacketDescriptor);
    }

    /**
     * MODIFIERS
     * */

    modifier evaluatedByOwner(
        address _subject,
        bytes memory _action,
        address _resource
    ) {
        require(
            OwnerSmartPolicy(ownerSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by OWNER policy"
        );
        _;
    }

    modifier evaluatedByCreator(
        address _subject,
        bytes memory _action,
        address _resource
    ) {
        require(
            CreatorSmartPolicy(creatorSmartPolicy).evaluate(
                _subject,
                _action,
                _resource
            ) == true,
            "Operation DENIED by CREATOR policy"
        );
        _;
    }



    // function getAssetDescriptor() public virtual override {}
}
