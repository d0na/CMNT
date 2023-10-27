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
      creatorSmartPolicy,
    };
  }

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketNMT();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });

  it("Should retrieve the holderSmartPolicy address", async function () {
    const { jacketNMT, jacketMutableAsset, denyAllSmartPolicy } =
      await deployJacketNMT();
    const holderSmartPolicyAddress =
      await jacketMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(denyAllSmartPolicy.address);
  });

  it("Should retrieve the creatorSmartPolicy address", async function () {
    const { jacketNMT, jacketMutableAsset, creatorSmartPolicy } =
      await deployJacketNMT();
    const creatorSmartPolicyAddress =
      await jacketMutableAsset.creatorSmartPolicy();
    expect(creatorSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the owner of the mutable asset", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const jowner = await jacketMutableAsset.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the jacket descriptor with default values", async function () {
    const { jacketMutableAsset } = await deployJacketNMT();
    const jacketDescriptor = await jacketMutableAsset.getJacketDescriptor();
    expect(jacketDescriptor.length).to.be.equal(2);
    expect(jacketDescriptor["color"]).to.be.equal(0); //not color defined
    expect(jacketDescriptor["sleeves"]).to.be.equal(false); //not color defined
  });

  it("Should setColor without policy evaluation", async function () {
    const { jacketMutableAsset } = await deployJacketNMT();
    const _setColor = await jacketMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(jacketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should be linked to some other NMT");

  describe("Changing smart policies", function () {
    it("Should be forbidden to change holder smart policy to the non-owner", async function () {
      const { jacketMutableAsset, creator, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset
          .connect(creator)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      ).to.be.rejectedWith("Caller is not the holder");
    });

    it("Should be allowed to change the holder's smart policy to holder", async function () {
      const { jacketMutableAsset, holderSmartPolicy, buyer } =
        await loadFixture(deployJacketNMT);
      await jacketMutableAsset
        .connect(buyer)
        .setHolderSmartPolicy(holderSmartPolicy.address);
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        holderSmartPolicy.address
      );
    });

    it("Should be forbidden to change the creator smart policy ", async function () {
      const { jacketMutableAsset, creator, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset
          .connect(creator)
          .setCreatorSmartPolicy(creatorSmartPolicy.address)
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    // it("Should be allowed to change the holder's smart policy to holder", async function () {
    //   const { jacketMutableAsset, buyer, holderSmartPolicy } =
    //     await loadFixture(deployJacketNMT);
    //   expect(await jacketMutableAsset.()).to.be.equal(
    //     "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9"
    //   );
    //   await expect(
    //     jacketMutableAsset
    //       .connect(buyer)
    //       .setHolderSmartPolicy(holderSmartPolicy.address)
    //   );
    //   expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
    //     "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"
    //   );
    // });
  });
});
