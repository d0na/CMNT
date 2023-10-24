import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketMutableAssetFail", function () {
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

  describe("The owner (buyer)", function () {
    it("should fail changing the color Jacket to 1 due to the DENY aLL Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });

    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(2, "red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    it("Should change the color Jacket to 5 and fail due to HOLDER Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(5, "yellow")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });

  describe("The tailor (tailor1)", function () {
    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor1 } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(tailor1).setColor(2, "red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });

  describe("The tailor (tailor2) not in the allowed creator list", function () {
    it("Should not change the color Jacket to 1 failing due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor2 } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(tailor2).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });
  describe("The creator (creator) not allowed by the HOLDER policy", function () {
    it("Should not change the color Jacket to 1 failing due to HOLDER Policy", async function () {
      const { jacketMutableAsset, creator } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(creator).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });
});
