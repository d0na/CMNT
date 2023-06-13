// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MutableAsset {
    address public currentOwner;

    // constructor(address owner){
    //     require(owner == address(owner),"Invalid owner address");
    //     currentOwner=owner;
    // }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function transferOwnership(address to) public virtual {
        require(to == address(to), "Invalid address");
        require(to != address(0), "Ownable: new owner is the zero address");

        address oldOwner = currentOwner;
        currentOwner = to;
        emit OwnershipTransferred(oldOwner, currentOwner);
    }

    function get3DModel() public pure returns(string memory){
        //Todo to define
        return string(abi.encodePacked("filename",".glb"));
    }

    /**
     * @dev Interrompe l'esecuzione se la funzione è chiamata da un account che non è proprietario.
     */
    modifier onlyOwner() {
        require(msg.sender == currentOwner, "Caller is not the owner");
        _;
    }


}
