// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

abstract contract SmartPolicy {
    function decodeData(
        bytes calldata approvePaylaod
    ) public pure returns (bytes memory, uint256) {
        uint256 num;
        bytes calldata signature = approvePaylaod[0:4];
        // `approvePaylaod[4:]` basically ignores the first 4 bytes of the payload
        (num) = abi.decode(approvePaylaod[4:], (uint256));
        return (signature, num);
    }

    // Extract the firt 4 byte containing the signature from the action payload
    function decodeSignature(
        bytes calldata _payload
    ) public pure returns (bytes4) {
        return
            bytes4(
                bytes.concat(_payload[0], _payload[1], _payload[2], _payload[3])
            );
    }

    /***
     * @dev Compare if strings are equals
     */
    function equal(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public virtual returns (bool);
}
