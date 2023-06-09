import { ethers } from "hardhat";

async function main() {

  const Contract = await ethers.getContractFactory("HelloWorld");
  const contract = await Contract.deploy("Test message");

  await contract.deployed();

  console.log(
    `Hello Word with Test Message string and deployed to ${contract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
