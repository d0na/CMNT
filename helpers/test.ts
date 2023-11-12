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


export async function deployJacketAssetWithManyAttributes() {
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

  //JacketMutableAsset
  const JacketMutableAsset = await ethers.getContractFactory(
    "JacketMutableAsset"
  );
  const jacketMutableAsset = await JacketMutableAsset.deploy(
    jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address
  );

  const JacketMutableAsset1 = await ethers.getContractFactory("JacketMutableAsset1");
  const jacketMutableAsset1 = await JacketMutableAsset1.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset2 = await ethers.getContractFactory("JacketMutableAsset2");
  const jacketMutableAsset2 = await JacketMutableAsset2.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset3 = await ethers.getContractFactory("JacketMutableAsset3");
  const jacketMutableAsset3 = await JacketMutableAsset3.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset4 = await ethers.getContractFactory("JacketMutableAsset4");
  const jacketMutableAsset4 = await JacketMutableAsset4.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset5 = await ethers.getContractFactory("JacketMutableAsset5");
  const jacketMutableAsset5 = await JacketMutableAsset5.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset6 = await ethers.getContractFactory("JacketMutableAsset6");
  const jacketMutableAsset6 = await JacketMutableAsset6.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset7 = await ethers.getContractFactory("JacketMutableAsset7");
  const jacketMutableAsset7 = await JacketMutableAsset7.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset8 = await ethers.getContractFactory("JacketMutableAsset8");
  const jacketMutableAsset8 = await JacketMutableAsset8.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset9 = await ethers.getContractFactory("JacketMutableAsset9");
  const jacketMutableAsset9 = await JacketMutableAsset9.deploy(jacketNMT.address,
    creatorSmartPolicy.address,
    holderSmartPolicy.address);
  const JacketMutableAsset10 = await ethers.getContractFactory("JacketMutableAsset10");
  const jacketMutableAsset10 = await JacketMutableAsset10.deploy(jacketNMT.address,
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
    jacketMutableAsset1,
    jacketMutableAsset2,
    jacketMutableAsset3,
    jacketMutableAsset4,
    jacketMutableAsset5,
    jacketMutableAsset6,
    jacketMutableAsset7,
    jacketMutableAsset8,
    jacketMutableAsset9,
    jacketMutableAsset10
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