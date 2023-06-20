// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./attributeManagers/PubAM.sol";

/**
 * @title PolicyInformationPoint
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice Interfaces with the AMs to retrieve informations about resoruce, subjects and enviroments
 */

contract PolicyInformationPoint {
    PubAM private _pubAm;

    constructor(address _brandContract) {
        _pubAm = PubAM(_brandContract);
    }

    // function setPDP(address pdpAddr) public {
    //     if (msg.sender != admin) {
    //         revert("Sender address differ from the admin address");
    //     }
    //     pdp = pdpAddr;
    // }

    // function checkSender(address sender) private view {
    //     if (sender != pdp) {
    //         revert("Sender address differ from pdp address");
    //     }
    // }

    function pubAllowedColorList() public view returns (string[] memory) {
        // checkSender(msg.sender);
        return _pubAm.allowedColorList();
    }

    function pubTailorList() public view returns (string[] memory) {
        // checkSender(msg.sender);
        return _pubAm.authorizedTailorList();
    }
}
