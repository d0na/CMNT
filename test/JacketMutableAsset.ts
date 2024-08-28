import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployJacketAsset } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("Tests related to the JacketMutableAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketAsset();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });

  it("Should retrieve the holderSmartPolicy address", async function () {
    const { jacketNMT, jacketMutableAsset, creatorSmartPolicy } =
      await deployJacketAsset();
    const holderSmartPolicyAddress =
      await jacketMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the creatorSmartPolicy address", async function () {
    const { jacketNMT, jacketMutableAsset, creatorSmartPolicy } =
      await deployJacketAsset();
    const creatorSmartPolicyAddress =
      await jacketMutableAsset.creatorSmartPolicy();
    expect(creatorSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the owner of the mutable asset", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketAsset();
    const jowner = await jacketMutableAsset.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the jacket descriptor with default values", async function () {
    const { jacketMutableAsset } = await deployJacketAsset();
    const jacketDescriptor = await jacketMutableAsset.getJacketDescriptor();
    expect(jacketDescriptor.length).to.be.equal(2);
    expect(jacketDescriptor["color"]).to.be.equal(0); //not color defined
    expect(jacketDescriptor["sleeves"]).to.be.equal(false); //not color defined
  });

  it("Should setColor without policy evaluation", async function () {
    const { jacketMutableAsset } = await deployJacketAsset();
    const _setColor = await jacketMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(jacketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should be linked to some other NMT");

  describe("Evaluating Smart Policies stuff", function () {

    it("Should evaluate successfully an action equal to setColor(1,url)", async function () {
      const { creatorSmartPolicy, creator, jacketMutableAsset } =
        await loadFixture(deployJacketAsset);

      expect(await creatorSmartPolicy.evaluate(
        creator.address,
        //The following corresponds to: ` abi.encodeWithSignature("setColor(uint,string)", <number>,<string>)`,
        "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
        jacketMutableAsset.address
      )).to.be.equal(true);
    });

    it("Should evaluate unsuccessfully an action equal to setColor(1,url) with the DENY ALL policy", async function () {
      const { denyAllSmartPolicy, creator, jacketMutableAsset } =
        await loadFixture(deployJacketAsset);
      expect(await denyAllSmartPolicy.evaluate(
        creator.address,
        "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
        jacketMutableAsset.address
      )).to.be.equal(false);
    });

    it("Should evaluate unsuccessfully an action equal to setColor(1,url) because denied by the DENY ALL policy (set to 0x)", async function () {
      const { buyer: holder, jacketMutableAsset } =
        await loadFixture(deployJacketAsset);
      await jacketMutableAsset.connect(holder).setHolderSmartPolicy(ZERO_ADDRESS);
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(ZERO_ADDRESS)
      await expect(
        jacketMutableAsset
          .setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });

  describe("Changing smart policies", function () {
    it("Should be forbidden to change holder smart policy to the non-owner", async function () {
      const { jacketMutableAsset, creator, holderSmartPolicy } =
        await loadFixture(deployJacketAsset);
      await expect(
        jacketMutableAsset
          .connect(creator)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      ).to.be.rejectedWith("Caller is not the holder");
    });

    it("Should be allowed to change the holder's smart policy to holder", async function () {
      const { jacketMutableAsset, holderSmartPolicy, buyer } =
        await loadFixture(deployJacketAsset);
      await jacketMutableAsset
        .connect(buyer)
        .setHolderSmartPolicy(holderSmartPolicy.address);
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        holderSmartPolicy.address
      );
    });

    it("Should be forbidden to change the creator smart policy ", async function () {
      const { jacketMutableAsset, creator, creatorSmartPolicy } =
        await loadFixture(deployJacketAsset);
      await expect(
        jacketMutableAsset
          .connect(creator)
          .setCreatorSmartPolicy(creatorSmartPolicy.address)
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    // it("Should be allowed to change the holder's smart policy to holder", async function () {
    //   const { jacketMutableAsset, buyer, holderSmartPolicy } =
    //     await loadFixture(deployJacketAsset);
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
