// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface MNTAsset {
    /**
     * @notice Asset rendering based on the current variables state 
     */
    function render() external view returns (uint);

    /**
     * @notice Extract the corret 3D model based on the current variables state  
     */
    function get3DModel() external view;

    /** @notice function used to asset initialization */
    function init() external view;
}
