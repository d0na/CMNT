// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

contract NMTUtils {
    function encodesTestUint() public pure returns (bytes memory) {
        // value : 0x00000000000000000000000000000000000000000000000000000000000000c8

        // Same way, better with abi.encodedPack
        // uint u = 200;
        // bytes32 b = bytes32(u);
        // bytes memory c = new bytes(32);
        // for (uint i = 0; i < 32; i++) {
        //     c[i] = b[i];
        // }
        // return c;

        uint x = 200;
        return abi.encodePacked(x);
    }

    function encodesTestBool() public pure returns (bytes memory) {
        // value : 0x01
        bool x = true;
        return abi.encodePacked(x);
    }

    function encodesTestHex() public pure returns (bytes memory) {
        // value : 0xff0000
        return abi.encodePacked(hex"FF0000");
    }

    function bytesToUint(bytes memory b) public pure returns (uint256) {
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number =
                number +
                uint(uint8(b[i])) *
                (2 ** (8 * (b.length - (i + 1))));
        }
        return number;
    }

    function bytesToBool(bytes memory data) public pure returns (bool b) {
        assembly {
            // Load the length of data (first 32 bytes)
            let len := mload(data)
            // Load the data after 32 bytes, so add 0x20
            b := mload(add(data, 0x20))
        }
    }

    function encTest() public pure returns (bytes memory) {
        uint256 _number = 200;
        return getEncodeWithSignature(_number);
    }

    function getEncodeWithSignature(
        uint256 _value
    ) public pure returns (bytes memory) {
        bytes memory data = abi.encodeWithSignature(
            "printNumber(uint256)",
            _value
        );

        return data;
    }

    function printTest() public pure returns (bytes4) {
        return bytes4(keccak256("printNumber(uint256)"));
    }

    function comparingSig() public view returns (bool) {
        bytes memory data = getEncodeWithSignature(200);
        bytes4 signature = bytes4(
            bytes.concat(data[0], data[1], data[2], data[3])
        );
        return bytes4(keccak256("printNumber(uint8)")) == signature;
    }

    function decodeData(
        bytes calldata approvePaylaod
    ) public pure returns (bytes memory, uint256) {
        uint256 num;
        bytes calldata signature = approvePaylaod[0:4];
        // `approvePaylaod[4:]` basically ignores the first 4 bytes of the payload
        (num) = abi.decode(approvePaylaod[4:], (uint256));
        return (signature, num);
    }

    function decodeSignature(
        bytes calldata _payload
    ) public view returns (bytes4) {
        return
            bytes4(
                bytes.concat(_payload[0], _payload[1], _payload[2], _payload[3])
            );
    }

    function compare(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }
}
