import { ethers } from "hardhat";

async function main() {


  const PubAMContract = await ethers.getContractFactory("PubAM");
  const pubAMContract = await PubAMContract.deploy();
  await pubAMContract.deployed();

  const PIPContract = await ethers.getContractFactory("PolicyInformationPoint");
  const pipContract = await PIPContract.deploy(pubAMContract.address);
  await pipContract.deployed();

  const PDPContract = await ethers.getContractFactory("PolicyDecisionPoint");
  const pdpContract = await PDPContract.deploy(pubAMContract.address);
  await pdpContract.deployed();

  console.log(
      `Deployed PubAMContract contract ${pubAMContract.address}\n` +
      `Deployed PIPContract contract ${pipContract.address}\n` +
      `Deployed PDPContract contract ${pdpContract.address}\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
