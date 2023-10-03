// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

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
}
