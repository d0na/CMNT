import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function getDescriptor(jacketAsset: any) {
  const restult = await jacketAsset.getJacketDescriptor();
  console.log(
    `Jacket Asset Descriptor[${jacketAsset.address}]:\n\tcolor:${restult["color"]}\n\tsleeves:${restult["removeSleeves"]}\n`
  );
}

async function getGasUsed(text:string,transaction: any) {
  const txReceipt = await transaction.wait();
  console.log(
    `* [GAS USED] ${text}:${Number(txReceipt.gasUsed as BigNumber)}\n`
  );
}

async function main() {
  const JAKCET_TOKENID = "297184396582543486746398363001857480971773017527";

  const [creator, tailor, owner] = await ethers.getSigners();
  //Jacket MNT
  const JacketNMT = await ethers.getContractFactory("JacketNMT");
  // const JACKET_MN_ADDR = '0x7B73b9ED4Af7ee9630CFdeCa866B5289Bf922876'
  // const JacketNMT = await JacketNMT.attach(JACKET_MN_ADDR)
  const jacketNMT = await JacketNMT.deploy();


  // Mint a new Jacket ASSET
  const mint = await jacketNMT.mint(owner.address);
  const txReceipt = await mint.wait();
  const events = txReceipt.events;
  const { tokenId } = events[1].args;
  const jacketAddress = await jacketNMT.getJacketAddress(tokenId);
  const jacketOwner = await jacketNMT.ownerOf(tokenId);
  console.log(
    `Minted new jacket Asset:\n\t[tokenID]:${tokenId}\n\t[address]:${jacketAddress}\n\t[owner]:${jacketOwner}`
  );
  getGasUsed('Mint operation',mint);

  // Get Jacket Asset
  const JacketAsset = await ethers.getContractFactory("JacketAsset");
  const jacketAsset = await JacketAsset.attach(jacketAddress);
  await getDescriptor(jacketAsset);

  // THE OWNER DECIDE TO CHANGE
  console.log(`** setColor No evaluated`)
  const setColorNotEvaluated = await jacketAsset.connect(owner).setColorNotEvaluated(1);
  getGasUsed('setColorNotEvaluated(1) operation',setColorNotEvaluated);

  // THE OWNER DECIDE TO CHANGE
  console.log(`** the owner [${owner.address}] decide to change color to 1 and the rules allow the operation`)
  const setColor1 = await jacketAsset.connect(owner).setColor(1);
  getGasUsed('SetColor(1) operation',setColor1);

  await getDescriptor(jacketAsset);
  console.log(`\n** the owner [${owner.address}] decide to change color to 2 and the owner rules deny the operation`)
  try {
    await jacketAsset.connect(owner).setColor(2);
  } catch (e) {
    console.log(e)
  }
  console.log(`** the owner [${owner.address}] decide to change color to 3 and the rules allow the operation`)
  try {
    const setColor3 = await jacketAsset.connect(owner).setColor(3);
    getGasUsed('SetColor(3) operation',setColor3);
    await getDescriptor(jacketAsset);
  } catch (e) {
    console.log(e)
  }

  console.log(`\n** the Tailor1 [${tailor.address}] can change change color to 1 and the rules allow the operation`)
  try {
    const setColor4 = await jacketAsset.connect(tailor).setColor(1);
    getGasUsed('SetColor(4) operation',setColor4);
    await getDescriptor(jacketAsset);
  } catch (e) {
    console.log(e)
  }

  console.log(`\n** the Tailor1 [${creator.address}] can't change change color to 3 because is not allow by the rules`)
  try {
    await jacketAsset.connect(creator).setColor(1);
    await getDescriptor(jacketAsset);
  } catch (e) {
    console.log(e)
  }
  //console.log("Set OwnerSmartPolicy:",await jacketAsset.setOwnerSmartPolicy('0x9f20fDCA6f19BeB45672eEeD1e2921caA05Ab0f6'))
  //  console.log("Get OwnerSmartPolicy:",await jacketAsset.ownerSmartPolicy)
  // console.log("Descriptor:",await jacketAsset.connect('0x21387C745c98f092C376151197E68e56E33de81e').setColor(1))

  // console.log("Descriptor:",await jacketAsset.connect('0x21387C745c98f092C376151197E68e56E33de81e').setColor(1))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
