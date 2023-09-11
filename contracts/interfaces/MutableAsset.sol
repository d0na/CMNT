// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MutableAsset {
    string public model3d; //sostiusce il vecchio 3dmodel (ancora però no)
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

    function get3DModel() public pure returns (string memory) {
        //Todo to define
        return string(abi.encodePacked("filename", ".glb"));
    }

    // Function to get the text
    function getModel3d() public view returns (string memory) {
        return string(abi.encodePacked(model3d));
    }

    /**
     * @dev Interrompe l'esecuzione se la funzione è chiamata da un account che non è proprietario.
     */
    modifier onlyOwner() {
        require(msg.sender == currentOwner, "Caller is not the owner");
        _;
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
