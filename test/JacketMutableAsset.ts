import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketMutableAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployJacketNMT() {
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
    const denyAllSmartPolicy = await CreatorSmartPolicy.deploy();

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
    };
  }

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketNMT();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });
  it("Should retrieve the owner of the mutable asset", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const jowner = await jacketMutableAsset.callStatic.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the jacket descriptor with default values", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const jacketDescriptor =
      await jacketMutableAsset.callStatic.getJacketDescriptor();
    expect(jacketDescriptor.length).to.be.equal(2);
    expect(jacketDescriptor["color"]).to.be.equal(0); //not color defined
    expect(jacketDescriptor["sleeves"]).to.be.equal(false); //not color defined
  });

  it("Should setColor without policy evaluation", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const _setColor = await jacketMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(jacketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should change CREATOR policy");
  xit("Should be linked to some other NMT");
  
  describe("Changing HOLDER smart policy", function () {
    it("Should be forbidden to the non-owner", async function () {
      const { jacketMutableAsset, creator, jacketAddress } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(creator).setHolderSmartPolicy(jacketAddress)
      ).to.be.rejectedWith("Caller is not the holder");
    });
    it("should be changed by the current holder", async function () {
      const { jacketMutableAsset, buyer, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"
      );
      await expect(
        jacketMutableAsset
          .connect(buyer)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      );
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"
      );
    });
  });
});
