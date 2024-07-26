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


    address virtualSwagBagNFT;
    address eventNFT;

    //EventTicket descriptor
    struct EventTicketDescriptor {
        uint256 eventItem;  // represents the tokenId of the event
        uint256 virtualSwagBag;  // represents the tokenId of of the virtual swag bag
        uint256 seatNumber; 
        uint256 expireDate;
        uint256 validationDate;
        bool virtualSwagBagAccess; // 
        bool backstageAccess;
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


    function setBackstageAccess(
        bool _backstageAccess,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setBackstageAccess(bool,string)",
                _backstageAccess,
                _tokenURI
            ),
            address(this)
        )
    {
        _setBackstageAccess(_backstageAccess, _tokenURI);
    }

    // Public only for evaluating costs
    function _setBackstageAccess(
        bool _backstageAccess,
        string memory _tokenURI
    ) public {
        eventTicketDescriptor.backstageAccess = _backstageAccess;
        setTokenURI(_tokenURI);
        emit StateChanged(eventTicketDescriptor);
    }

    function setSeat(
        uint256 _seatNumber,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setSeat(uint256,string)",
                _seatNumber,
                _tokenURI
            ),
            address(this)
        )
    {
        _setSeat(_seatNumber, _tokenURI);
    }

    // Public only for evaluating costs
    function _setSeat(
        uint256 _seatNumber,
        string memory _tokenURI
    ) public {
        eventTicketDescriptor.seatNumber = _seatNumber;
        setTokenURI(_tokenURI);
        emit StateChanged(eventTicketDescriptor);
    }

    function setValidationDate(
        uint256 _validationDate,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setValidationDate(uint256,string)",
                _validationDate,
                _tokenURI
            ),
            address(this)
        )
    {
        _setValidationDate(_validationDate, _tokenURI);
    }

    // Public only for evaluating costs
    function _setValidationDate(
        uint256 _validationDate,
        string memory _tokenURI
    ) public {
        eventTicketDescriptor.validationDate = _validationDate;
        setTokenURI(_tokenURI);
        emit StateChanged(eventTicketDescriptor);
    }


    function setVirtualSwagBagAccess(
        bool _virtualSwagBagAccess,
        string memory _tokenURI
    )
        public
        evaluatedByCreator(
            msg.sender,
            abi.encodeWithSignature(
                "setVirtualSwagBagAccess(bool,string)",
                _virtualSwagBagAccess,
                _tokenURI
            ),
            address(this)
        )
    {
        _setVirtualSwagBagAccess(_virtualSwagBagAccess, _tokenURI);
    }

    // Public only for evaluating costs
    function _setVirtualSwagBagAccess(
        bool _virtualSwagBagAccess,
        string memory _tokenURI
    ) public {
        eventTicketDescriptor.virtualSwagBagAccess = _virtualSwagBagAccess;
        setTokenURI(_tokenURI);
        emit StateChanged(eventTicketDescriptor);
    }


    function setVirtualSwagBag(
        uint256 _virtualSwagBagTokenId,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setVirtualSwagBag(uint256,string)",
                _virtualSwagBagTokenId,
                _tokenURI
            ),
            address(this)
        )
    {
        _setVirtualSwagBag(_virtualSwagBagTokenId, _tokenURI);
    }

    // Public only for evaluating costs
    function _setVirtualSwagBag(
        uint256 _virtualSwagBagTokenId,
        string memory _tokenURI
    ) public {
        eventTicketDescriptor.virtualSwagBag = _virtualSwagBagTokenId;
        setTokenURI(_tokenURI);
        emit StateChanged(eventTicketDescriptor);
    }
}
