import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("JacketNMT");
  const contract = await Contract.deploy();

  const account1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const account2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const txResponse = await contract.mint(account1);
  const txReceipt = await txResponse.wait();
  const jacketAddress = await contract.getJacketIntAddress();

  console.log(
    `Deployed JacketMNT contract ${JSON.stringify(txReceipt, null, 3)}`
  );

  console.log(`Jacket tokenId`, jacketAddress);
  console.log(`Jacket owner`, await contract.ownerOf(jacketAddress));


  console.log(`Jacket transfer`, await contract.transferFrom(account1,account2,"921600849408656576225127304129841157239410643646"));


  // const jacketAddress2 = await contract.getJacketIntAddress();
  // console.log(`Jacket owner`, await contract.ownerOf(jacketAddress2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
