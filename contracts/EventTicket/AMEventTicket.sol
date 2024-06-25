// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract AMEventTicket {

    uint256 public releasedTickets = 0;

    function releaseTicket() public returns (uint256) {
        releasedTickets++;
        return releasedTickets;
    }

    function retireTicket() public returns (uint256) {
        require(releasedTickets > 0, "There aren't tickets.");
        releasedTickets--;
        return releasedTickets;
    }
}
