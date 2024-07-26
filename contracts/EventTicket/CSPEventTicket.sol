// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";
import "../base/NMT.sol";
import "../base/MutableAsset.sol";
import "./AMEventOrganizer.sol";
import "./EventTicketMutableAsset.sol";

contract CSPEventTicket is SmartPolicy {
    /*
            
        Subject : who required the resource
        Resources: the elements which the Subject wants to access
        Action: the action goal of the policy

        Rule: determines rules for each policy, is effect  can be PERMIT/DENY 
        Target: used to check the validity of the action regarding the resource
                It is composed by:
                1. One or more Subjects
                2. An Action - the aciont goal of the policy
                3. The involved resources to protect
            
    */
    //mapping(bytes32 => bytes32) private AllowedActions;

    bytes4 internal constant ACT_TRANSFER_FROM =
        bytes4(keccak256("transferFrom(address,address)"));
    bytes4 internal constant ACT_PAYBLE_TRANSFER_FROM =
        bytes4(keccak256("payableTransferFrom(address,address,uint256)"));
    bytes4 internal constant ACT_SET_BIKE_TRANSPORT =
        bytes4(keccak256("setBikeTransport(bool,string)"));
    bytes4 internal constant ACT_SET_BACKSTAGE_ACCESS =
        bytes4(keccak256("setBackstageAccess(bool,string)"));
    bytes4 internal constant ACT_SET_SEAT =
        bytes4(keccak256("setSeat(uint256,string)"));
    bytes4 internal constant ACT_SET_VALIDATION_DATE =
        bytes4(keccak256("setValidationDate(uint256,string)"));
    bytes4 internal constant ACT_SET_VIRTUAL_SWAG_BAG_ACCESS =
        bytes4(keccak256("setVirtualSwagBagAccess(bool,string)"));
    bytes4 internal constant ACT_SET_VIRTUAL_SWAG_BAG =
        bytes4(keccak256("setVirtualSwagBag(uint256,string)"));

    AMEventOrganizer private amEventOrganizer;

    constructor(address _eventOrganizerAM) {
        amEventOrganizer = AMEventOrganizer(_eventOrganizerAM);
    }

    // is public because if not is not possibile do the trick this.getSetColorParam and bypass the
    // memory and calldata check
    function getSetBackstageAccessParam(
        bytes calldata _payload
    ) public pure returns (uint256) {
        return abi.decode(_payload[4:], (uint256));
    }

    function getTransferFromParam(
        bytes calldata _payload
    ) public pure returns (address, address) {
        return abi.decode(_payload[4:], (address, address));
    }

    function getPayableTransferFromParam(
        bytes calldata _payload
    ) public pure returns (address, address, uint256) {
        return abi.decode(_payload[4:], (address, address, uint256));
    }

    // Condition 1
    function _isExtraServiceAuthorizedUser(
        address _user
    ) private pure returns (bool) {
        // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        // tailor - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
        return
            // _user == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 || //test account1
            _user == 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; //test account2
        // _user == 0x7DE5260b6964bAE3678f3C7a8c45628af2CeAc28 || // sepolia 2
        // _user == 0x901D7C8d516a5c97bFeE31a781A1101D10BBc8e9; // sepolia 3
    }

    // Condition 1
    function _isOrganizerAuthorizedUser(
        address _user
    ) private pure returns (bool) {
        // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        // tailor - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
        return
            // _user == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 || //test account1
            _user == 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65; //test ethers.getSigners[4]
        // _user == 0x7DE5260b6964bAE3678f3C7a8c45628af2CeAc28 || // sepolia 2
        // _user == 0x901D7C8d516a5c97bFeE31a781A1101D10BBc8e9; // sepolia 3
    }

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        bytes4 _signature = this.decodeSignature(_action);
        // console.log("Passed action [CREATOR SP]:");
        // console.logBytes(_action);
        // console.logBytes4(_signature);
        // console.logBytes4(ACT_SET_BACKSTAGE_ACCESS);

        if (_signature == ACT_PAYBLE_TRANSFER_FROM) {
            (address from, address to, uint256 amount) = this
                .getPayableTransferFromParam(_action);
            if (amount >= 101) {
                return false;
            }
            return true;
        }

        if (_signature == ACT_TRANSFER_FROM) {
            (address from, address to) = this.getTransferFromParam(_action);
            return _calcInstancesCount(_resource, to) <= 3;
        }

        if (_signature == ACT_SET_BIKE_TRANSPORT) {
            return _isExtraServiceAuthorizedUser(_subject);
        }

        if (_signature == ACT_SET_BACKSTAGE_ACCESS) {
            address owner = EventTicketMutableAsset(_resource).getHolder();
            uint256 seatNumber = EventTicketMutableAsset(_resource)
                .getEventTicketDescriptor()
                .seatNumber;
            // console.log("subject %s", _subject);
            // console.log("owner %s", owner);
            // console.log(
            //     " amEventOrganizer.isPremiumMember(owner) %s",
            //     _subject == owner && amEventOrganizer.isPremiumMember(owner)
            // );
            return
                _subject == owner &&
                amEventOrganizer.hasPremiumMemberRole(owner) &&
                seatNumber <= 100;
        }

        if (_signature == ACT_SET_SEAT) {
            return _isOrganizerAuthorizedUser(_subject);
        }

        if (_signature == ACT_SET_VALIDATION_DATE) {
            return amEventOrganizer.hasLogistiSupportRole(_subject);
        }

        if (_signature == ACT_SET_VIRTUAL_SWAG_BAG_ACCESS) {
            return amEventOrganizer.hasLogistiSupportRole(_subject);
        }

        if (_signature == ACT_SET_VIRTUAL_SWAG_BAG) {
            bool virtualSwagBagAccess = EventTicketMutableAsset(_resource)
                .getEventTicketDescriptor()
                .virtualSwagBagAccess;
            return
                amEventOrganizer.hasLogistiSupportRole(_subject) &&
                virtualSwagBagAccess;
        }

        return false;
    }

    function _calcInstancesCount(
        address _res,
        address _subj
    ) private view returns (uint256) {
        return MutableAsset(_res).nmtContract().balanceOf(_subj);
    }

    fallback() external {
        //console.log("Fallback CreatorSmartPolicy");
    }
}
