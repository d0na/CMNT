import { ethers } from "hardhat";

async function getDescriptor(jacketAsset: any) {
  const restult = await jacketAsset.getJacketDescriptor();
  console.log(
    `Jacket Asset Descriptor[${jacketAsset.address}]:\n\tcolor:${restult["color"]}\n\tsleeves:${restult["removeSleeves"]}\n`
  );
}

async function main() {
  const JAKCET_TOKENID = "297184396582543486746398363001857480971773017527";

  const [creator, tailor, owner] = await ethers.getSigners();
  //Jacket MNT
  const JacketMnt = await ethers.getContractFactory("JacketMNT");
  // const JACKET_MN_ADDR = '0x7B73b9ED4Af7ee9630CFdeCa866B5289Bf922876'
  // const jacketMnt = await JacketMnt.attach(JACKET_MN_ADDR)
  const jacketMnt = await JacketMnt.deploy();

  console.log(`Created Jacket MNT [${jacketMnt.address}]`);
  // Mint a new Jacket ASSET
  const mint = await jacketMnt.mint(owner.address);
  const txReceipt = await mint.wait();
  const events = txReceipt.events;
  const { tokenId } = events[1].args;
  const jacketAddress = await jacketMnt.getJacketAddress(tokenId);
  const jacketOwner = await jacketMnt.ownerOf(tokenId);
  console.log(
    `Minted new jacket Asset:\n\t[tokenID]:${tokenId}\n\t[address]:${jacketAddress}\n\t[owner]:${jacketOwner}`
  );

  // Get Jacket Asset
  const JacketAsset = await ethers.getContractFactory("JacketAsset");
  const jacketAsset = await JacketAsset.attach(jacketAddress);
  await getDescriptor(jacketAsset);
  // THE OWNER DECIDE TO CHANGE
  console.log(`** the owner [${owner.address}] decide to change color to 1 and the rules allow the operation`)
  await jacketAsset.connect(owner).setColor(1);
  await getDescriptor(jacketAsset);
  console.log(`** the owner [${owner.address}] decide to change color to 2 and the owner rules deny the operation`)
  try {
    await jacketAsset.connect(owner).setColor(2);
  } catch (e){
    console.log(e)
  }
  console.log(`** the owner [${owner.address}] decide to change color to 3 and the rules allow the operation`)
  try {
    await jacketAsset.connect(owner).setColor(3);
    await getDescriptor(jacketAsset);
  } catch (e){
    console.log(e)
  }

  console.log(`** the Tailor1 [${tailor.address}] can change change color to 1 and the rules allow the operation`)
  try {
    await jacketAsset.connect(tailor).setColor(1);
    await getDescriptor(jacketAsset);
  } catch (e){
    console.log(e)
  }

  console.log(`** the Tailor1 [${creator.address}] can't change change color to 3 because is not allow by the rules`)
  try {
    await jacketAsset.connect(creator).setColor(1);
    await getDescriptor(jacketAsset);
  } catch (e){
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
