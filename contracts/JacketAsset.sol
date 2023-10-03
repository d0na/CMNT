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
    {}

    using Strings for string;

    //Jacket descriptor
    struct JacketDescriptor {
        string color;
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

    function setColor(
        string memory _color
    )
        public
        canSetColorByCreator(
            msg.sender,
            "0x6368616e67655f636f6c6f72",
            address(0),
            _color
        )
        canSetColorByOwner(
            msg.sender,
            "0x6368616e67655f636f6c6f72",
            address(0),
            _color
        )
    {
        jacketDescriptor.color = _color;
        emit StateChanged(jacketDescriptor);
    }

    function setRemoveSleeves(bool _removeSleeves) public {
        jacketDescriptor.removeSleeves = _removeSleeves;
        emit StateChanged(jacketDescriptor);
    }

    /**
     * MODIFIERS
     * */

    modifier canSetColorByCreator(
        address _subject,
        bytes32 _action,
        address _resource,
        string memory _color
    ) {
        require(
            CreatorSmartPolicy(creatorSmartPolicy).evalSetColor(
                _subject,
                _action,
                _resource,
                _color
            ) == true,
            "Color change operation DENIED by creator policy"
        );
        _;
    }

    modifier canSetColorByOwner(
        address _subject,
        bytes32 _action,
        address _resource,
        string memory _color
    ) {
        require(
            OwnerSmartPolicy(ownerSmartPolicy).evalSetColor(
                _subject,
                _action,
                _resource,
                _color
            ) == true,
            "Color change operation DENIED by owner policy"
        );
        _;
    }

    // modifier canSetSleevsByCreator(
    //     address _subject,
    //     bytes32 _action,
    //     address _resource,
    //     bool _sleeves
    // ) {
    //     require(
    //         CreatorSmartPolicy(creatorSmartPolicy).evalSetSleeves(
    //             _subject,
    //             _action,
    //             _resource
    //         ) == true,
    //         "Change Color operation DENY"
    //     );
    //     _;
    // }
    // function getAssetDescriptor() public virtual override {}
}
