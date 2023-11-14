import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export async function deployJacketAsset() {
  // Contracts are deployed using the first signer/account by default
  const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
  // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  // tailor1 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  // tailor2 - 0x90F79bf6EB2c4f870365E785982E1f101E93b906

  // JacketNMT
  const JacketNMT = await ethers.getContractFactory("JacketNMT");
  const jacketNMT = await JacketNMT.deploy();
  // HolderSmartPolicy
  const HolderSmartPolicy = await ethers.getContractFactory(
    "HolderSmartPolicy"
  );
  const holderSmartPolicy = await HolderSmartPolicy.deploy();
  // CreatorSmartPolicy
  const CreatorSmartPolicy = await ethers.getContractFactory(
    "CreatorSmartPolicy"
  );
  const creatorSmartPolicy = await CreatorSmartPolicy.deploy();
  // DenyAllSmartPolicy
  const DenyAllSmartPolicy = await ethers.getContractFactory(
    "DenyAllSmartPolicy"
  );
  const denyAllSmartPolicy = await DenyAllSmartPolicy.deploy();

  //JacketMutableAsset mint
  const mintTx = await jacketNMT.mint(
    buyer.address,
    creatorSmartPolicy.address,
    denyAllSmartPolicy.address
  );
  const mintResponse = await mintTx.wait();
  const jacketTokenId = mintResponse.events[0].args["tokenId"];
  const jacketAddress = await jacketNMT.getJacketAddress(jacketTokenId);
  //JacketMutableAsset
  const JacketMutableAsset = await ethers.getContractFactory(
    "JacketMutableAsset"
  );
  const jacketMutableAsset = JacketMutableAsset.attach(jacketAddress);

  return {
    jacketNMT,
    jacketAddress,
    jacketTokenId,
    jacketMutableAsset,
    creator,
    buyer,
    tailor1,
    tailor2,
    holderSmartPolicy,
    denyAllSmartPolicy,
    creatorSmartPolicy,
  };
}

export async function deployJacketAssetWithHolderPolicy() {
  // Contracts are deployed using the first signer/account by default
  const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
  // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  // tailor1 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  // tailor2 - 0x90F79bf6EB2c4f870365E785982E1f101E93b906

  // JacketNMT
  const JacketNMT = await ethers.getContractFactory("JacketNMT");
  const jacketNMT = await JacketNMT.deploy(creator.address);
  // HolderSmartPolicy
  const HolderSmartPolicy = await ethers.getContractFactory(
    "HolderSmartPolicy"
  );
  const holderSmartPolicy = await HolderSmartPolicy.deploy();
  // CreatorSmartPolicy
  const CreatorSmartPolicy = await ethers.getContractFactory(
    "CreatorSmartPolicy"
  );
  const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

  //JacketMutableAsset
  const JacketMutableAsset = await ethers.getContractFactory(
    "JacketMutableAsset"
  );
  const jacketMutableAsset = await JacketMutableAsset.deploy(
    jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address
  );

  return {
    jacketNMT,
    jacketMutableAsset,
    creator,
    buyer,
    tailor1,
    tailor2,
    holderSmartPolicy,
    creatorSmartPolicy,
  };
}


export async function deployMutableAssetWithManySetters() {
  // Contracts are deployed using the first signer/account by default
  const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
  // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  // tailor1 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  // tailor2 - 0x90F79bf6EB2c4f870365E785982E1f101E93b906

  // JacketNMT
  const JacketNMT = await ethers.getContractFactory("JacketNMT");
  const jacketNMT = await JacketNMT.deploy(creator.address);
  // HolderSmartPolicy
  const MSExpHolderSmartPolicy = await ethers.getContractFactory(
    "MSExpHolderSmartPolicy"
  );
  const holderSmartPolicy = await MSExpHolderSmartPolicy.deploy();
  // CreatorSmartPolicy
  const MSExpCreatorSmartPolicy = await ethers.getContractFactory(
    "MSExpCreatorSmartPolicy"
  );
  const creatorSmartPolicy = await MSExpCreatorSmartPolicy.deploy();

  const MutableAsset1 = await ethers.getContractFactory("MutableAsset1");
  const mutableAsset1 = await MutableAsset1.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset2 = await ethers.getContractFactory("MutableAsset2");
  const mutableAsset2 = await MutableAsset2.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset3 = await ethers.getContractFactory("MutableAsset3");
  const mutableAsset3 = await MutableAsset3.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset4 = await ethers.getContractFactory("MutableAsset4");
  const mutableAsset4 = await MutableAsset4.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset5 = await ethers.getContractFactory("MutableAsset5");
  const mutableAsset5 = await MutableAsset5.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset6 = await ethers.getContractFactory("MutableAsset6");
  const mutableAsset6 = await MutableAsset6.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset7 = await ethers.getContractFactory("MutableAsset7");
  const mutableAsset7 = await MutableAsset7.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset8 = await ethers.getContractFactory("MutableAsset8");
  const mutableAsset8 = await MutableAsset8.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset9 = await ethers.getContractFactory("MutableAsset9");
  const mutableAsset9 = await MutableAsset9.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset10 = await ethers.getContractFactory("MutableAsset10");
  const mutableAsset10 = await MutableAsset10.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);

  return {
    jacketNMT,
    creator,
    buyer,
    tailor1,
    tailor2,
    holderSmartPolicy,
    creatorSmartPolicy,
    mutableAsset1,
    mutableAsset2,
    mutableAsset3,
    mutableAsset4,
    mutableAsset5,
    mutableAsset6,
    mutableAsset7,
    mutableAsset8,
    mutableAsset9,
    mutableAsset10
  };
}

export async function deployMutableAssetWithManyParams() {
  // Contracts are deployed using the first signer/account by default
  const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
  // creator    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // buyer - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  // tailor1 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  // tailor2 - 0x90F79bf6EB2c4f870365E785982E1f101E93b906

  // JacketNMT
  const JacketNMT = await ethers.getContractFactory("JacketNMT");
  const jacketNMT = await JacketNMT.deploy(creator.address);
  // HolderSmartPolicy
  const MPExpHolderSmartPolicy = await ethers.getContractFactory(
    "MPExpHolderSmartPolicy"
  );
  const holderSmartPolicy = await MPExpHolderSmartPolicy.deploy();
  // CreatorSmartPolicy
  const MPExpCreatorSmartPolicy = await ethers.getContractFactory(
    "MPExpCreatorSmartPolicy"
  );
  const creatorSmartPolicy = await MPExpCreatorSmartPolicy.deploy();

  //JacketMutableAsset
  const JacketMutableAsset = await ethers.getContractFactory(
    "JacketMutableAsset"
  );
  const jacketMutableAsset = await JacketMutableAsset.deploy(
    jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address
  );

  const MutableAsset1a = await ethers.getContractFactory("MutableAsset1a");
  const mutableAsset1a = await MutableAsset1a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset2a = await ethers.getContractFactory("MutableAsset2a");
  const mutableAsset2a = await MutableAsset2a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset3a = await ethers.getContractFactory("MutableAsset3a");
  const mutableAsset3a = await MutableAsset3a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset4a = await ethers.getContractFactory("MutableAsset4a");
  const mutableAsset4a = await MutableAsset4a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset5a = await ethers.getContractFactory("MutableAsset5a");
  const mutableAsset5a = await MutableAsset5a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset6a = await ethers.getContractFactory("MutableAsset6a");
  const mutableAsset6a = await MutableAsset6a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset7a = await ethers.getContractFactory("MutableAsset7a");
  const mutableAsset7a = await MutableAsset7a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset8a = await ethers.getContractFactory("MutableAsset8a");
  const mutableAsset8a = await MutableAsset8a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset9a = await ethers.getContractFactory("MutableAsset9a");
  const mutableAsset9a = await MutableAsset9a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const MutableAsset10a = await ethers.getContractFactory("MutableAsset10a");
  const mutableAsset10a = await MutableAsset10a.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);

  return {
    jacketNMT,
    jacketMutableAsset,
    creator,
    buyer,
    tailor1,
    tailor2,
    holderSmartPolicy,
    creatorSmartPolicy,
    mutableAsset1a,
    mutableAsset2a,
    mutableAsset3a,
    mutableAsset4a,
    mutableAsset5a,
    mutableAsset6a,
    mutableAsset7a,
    mutableAsset8a,
    mutableAsset9a,
    mutableAsset10a
  };
}