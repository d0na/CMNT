
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/NMT.sol";
import "../base/MutableAsset.sol";

 /* 
 * @title EventTicket Mutable Asset
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice EventTicket Asset rapresentation 
 */
 contract EventTicketMutableAsset is MutableAsset {
     constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    //EventTicket descriptor
    struct EventTicketDescriptor {
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

    // Current state representing EventTicket descriptor with its attributes
    EventTicketDescriptor public eventTicketDescriptor;

    /** Retrieves all the attributes of the descriptor EventTicket
     *
     * TODO forse visto che EventTicketDescriptor è public nn doverebbe servire
     */
    function getEventTicketDescriptor()
        public
        view
        returns (EventTicketDescriptor memory)
    {
        return (eventTicketDescriptor);
    }

    event StateChanged(EventTicketDescriptor eventTicketDescriptor);

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
    //     eventTicketDescriptor.color = _color;
    //     setTokenURI(_tokenURI);
    //     emit StateChanged(eventTicketDescriptor);
    // }
 }