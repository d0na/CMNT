 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/NMT.sol";
import "../base/MutableAsset.sol";

 /* 
 * @title TrainTicket Mutable Asset
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice TrainTicket Asset rapresentation 
 */
 contract TrainTicketMutableAsset is MutableAsset {
     constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    //TrainTicket descriptor
    struct TrainTicketDescriptor {
        string passengerName;
        uint256 seat;
        uint256 class;
        uint256 to;
        uint256 from;
        uint256 expireDate;
        uint256 stampDate;
        uint256 checkTicketDate;
        bool bikeTransport;
        bool animalTransport;
    }

    // Current state representing TrainTicket descriptor with its attributes
    TrainTicketDescriptor public trainTicketDescriptor;

    /** Retrieves all the attributes of the descriptor TrainTicket
     *
     * TODO forse visto che TrainTicketDescriptor è public nn doverebbe servire
     */
    function getTrainTicketDescriptor()
        public
        view
        returns (TrainTicketDescriptor memory)
    {
        return (trainTicketDescriptor);
    }

    event StateChanged(TrainTicketDescriptor trainTicketDescriptor);

    /**
     * USERS ACTIONS with attached policy
     * */

    fallback() external {}

    // function setName(
    //     string _name,
    //     string memory _tokenURI
    // )
    //     public
    //     evaluatedByCreator(
    //         msg.sender,
    //         abi.encodeWithSignature(
    //             "setColor(uint256,string)",
    //             _color,
    //             _tokenURI
    //         ),
    //         address(this)
    //     )
    //     evaluatedByHolder(
    //         msg.sender,
    //         abi.encodeWithSignature(
    //             "setColor(uint256,string)",
    //             _color,
    //             _tokenURI
    //         ),
    //         address(this)
    //     )
    // {
    //     _setName(_name, _tokenURI);
    // }

    // // Public only for evaluating costs
    // function _setName(uint256 _color, string memory _tokenURI) public {
    //     trainTicketDescriptor.color = _color;
    //     setTokenURI(_tokenURI);
    //     emit StateChanged(trainTicketDescriptor);
    // }
 }