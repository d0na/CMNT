import {
  time,
  loadFixture,
  mine,
  impersonateAccount,
} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { buffer } from "stream/consumers";

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
    const CreatorSmartPolicy = await ethers.getContractFactory("CreatorSmartPolicy");
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();
    //JacketMutableAsset mint
    const mintTx = await jacketNMT.mint(buyer.address, creatorSmartPolicy.address);
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
    };
  }

  it("Should retrieve the NMT parent address", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketNMT();
    const nmt = await jacketMutableAsset.callStatic.getNMT();
    expect(nmt).to.be.equal(jacketNMT.address);
  });
  it("Should retrieve the owner of the mutable asset by getHolder method", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const jowner = await jacketMutableAsset.callStatic.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });
  it("Should retrieve jacketDescriptor with color:0 and sleeves:false", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const jacketDescriptor =
      await jacketMutableAsset.callStatic.getJacketDescriptor();
    expect(jacketDescriptor.length).to.be.equal(2);
    expect(jacketDescriptor["color"]).to.be.equal(0); //not color defined
    expect(jacketDescriptor["sleeves"]).to.be.equal(false); //not color defined
  });

  it("Should setColor to 1 without policy evaluation", async function () {
    const { jacketMutableAsset, buyer } = await deployJacketNMT();
    const setColorNotEvaluated = await jacketMutableAsset._setColor(
      1
    ,'green');
    await expect(setColorNotEvaluated)
      .to.emit(jacketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  describe("The owner (buyer)", function () {
    it("should fail changing the color Jacket to 1 due to the DENY aLL Policy", async function () {
      const { jacketMutableAsset, buyer, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(1,"green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });

    it("should set new Holder Smart Policy", async function () {
      const { jacketMutableAsset, buyer, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        "0x2b961E3959b79326A8e7F64Ef0d2d825707669b5"
      );
      await expect(
        jacketMutableAsset
          .connect(buyer)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      );
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(
        "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"
      );
    });

    it("should successfully change the color Jacket to 1 after change the Holder Smart Policy ", async function () {
      const { jacketMutableAsset, buyer, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset
          .connect(buyer)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      );
      await expect(jacketMutableAsset.connect(buyer).setColor(1,"green"))
        .to.emit(jacketMutableAsset, "StateChanged")
        .withArgs([1, false]);
    });

    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(2,"red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    it("Should change the color Jacket to 5 and fail due to HOLDER Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset.connect(buyer).setColor(5,"yellow")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });

  describe("The tailor (tailor1)", function () {
    it("should change the color Jacket to 3 successfully after that the Holder changed the holderSmartPolicy", async function () {
      const { jacketMutableAsset, tailor1, buyer, holderSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await expect(
        jacketMutableAsset
          .connect(buyer)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      );
      await expect(jacketMutableAsset.connect(tailor1).setColor(3,"blu"))
        .to.emit(jacketMutableAsset, "StateChanged")
        .withArgs([3, false]);
    });

    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor1 } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(tailor1).setColor(2,"red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });

  describe("The tailor (tailor2) not in the allowed creator list", function () {
    it("Should not change the color Jacket to 1 failing due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor2 } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(tailor2).setColor(1,"green")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });
  describe("The creator (creator) not allowed by the HOLDER policy", function () {
    it("Should not change the color Jacket to 1 failing due to HOLDER Policy", async function () {
      const { jacketMutableAsset, creator } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(creator).setColor(1,"green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });
  describe("Changing HOLDER smart policy", function () {
    it("Should be forbidden to the non-owner", async function () {
      const { jacketMutableAsset, creator, jacketAddress } = await loadFixture(
        deployJacketNMT
      );
      await expect(
        jacketMutableAsset.connect(creator).setHolderSmartPolicy(jacketAddress)
      ).to.be.rejectedWith("Caller is not the holder");
    });
    // it("Should change smart policy", async function () {
    //   const { jacketMutableAsset, creator,jacketAddress } = await loadFixture(deployJacketNMT);

    //   await expect(jacketMutableAsset.connect(creator).setOwnerSmartPolicy(jacketAddress)).to.be.rejectedWith(
    //     "Caller is not the owner"
    //   );
    // });
  });
});
