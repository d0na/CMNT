// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract HelloWorld {

   string public message;

   constructor(string memory initMessage){
      message = initMessage;
   }

   function getMessage() public view returns (string memory){
      return message;
   }

   function update(string memory newMessage) public {
      message = newMessage;
      }
}