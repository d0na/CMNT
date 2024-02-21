import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployWalletAsset } from "../../helpers/walletTest";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("WalletMutableAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { walletNMT, walletMutableAsset } = await deployWalletAsset();
    const nmt = await walletMutableAsset.nmt();
    expect(nmt).to.be.equal(walletNMT.address);
  });

  it("Should retrieve the holderSmartPolicy address", async function () {
    const { walletNMT, walletMutableAsset, denyAllSmartPolicy } =
      await deployWalletAsset();
    const holderSmartPolicyAddress =
      await walletMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(denyAllSmartPolicy.address);
  });

  it("Should retrieve the creatorSmartPolicy address", async function () {
    const { walletNMT, walletMutableAsset, creatorSmartPolicy } =
      await deployWalletAsset();
    const creatorSmartPolicyAddress =
      await walletMutableAsset.creatorSmartPolicy();
    expect(creatorSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the owner of the mutable asset", async function () {
    const { walletMutableAsset, buyer } = await deployWalletAsset();
    const jowner = await walletMutableAsset.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the wallet descriptor with default values", async function () {
    const { walletMutableAsset } = await deployWalletAsset();
    const walletDescriptor = await walletMutableAsset.getWalletDescriptor();
    expect(walletDescriptor.length).to.be.equal(5); // attribute numbers
    expect(walletDescriptor["trainCompanyRewards"]).to.be.equal(0); 
    expect(walletDescriptor["backgroundColor"]).to.be.equal(0);  
    expect(walletDescriptor["texture"]).to.be.equal(0);  
    expect(walletDescriptor["logo"]).to.be.equal(''); 
    expect(walletDescriptor["name"]).to.be.equal(''); 
  });

  it("Should setColor without policy evaluation", async function () {
    const { walletMutableAsset } = await deployWalletAsset();
    const _setColor = await walletMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(walletMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should be linked to some other NMT");

  describe("Smart Policies stuff", function () {
    it("Should evaluate successfully an action equal to setColor(1,url)", async function () {
      const { creatorSmartPolicy, creator, walletMutableAsset } =
        await loadFixture(deployWalletAsset);
       expect(
        await creatorSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          walletMutableAsset.address
        )
      ).to.be.equal(true);
    });
    it("Should evaluate successfully an action equal to setColor(1,url) with the DENY ALL policy", async function () {
      const { denyAllSmartPolicy, creator, walletMutableAsset } =
        await loadFixture(deployWalletAsset);
       expect(
        await denyAllSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          walletMutableAsset.address
        )
      ).to.be.equal(false);
    });
  });

  describe("Changing smart policies", function () {
    it("Should be forbidden to change holder smart policy to the non-owner", async function () {
      const { walletMutableAsset, creator, holderSmartPolicy } =
        await loadFixture(deployWalletAsset);
      await expect(
        walletMutableAsset
          .connect(creator)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      ).to.be.rejectedWith("Caller is not the holder");
    });

    it("Should be allowed to change the holder's smart policy to holder", async function () {
      const { walletMutableAsset, holderSmartPolicy, buyer } =
        await loadFixture(deployWalletAsset);
      await walletMutableAsset
        .connect(buyer)
        .setHolderSmartPolicy(holderSmartPolicy.address);
      expect(await walletMutableAsset.holderSmartPolicy()).to.be.equal(
        holderSmartPolicy.address
      );
    });

    it("Should be forbidden to change the creator smart policy ", async function () {
      const { walletMutableAsset, creator, creatorSmartPolicy } =
        await loadFixture(deployWalletAsset);
      await expect(
        walletMutableAsset
          .connect(creator)
          .setCreatorSmartPolicy(creatorSmartPolicy.address)
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    // it("Should be allowed to change the holder's smart policy to holder", async function () {
    //   const { walletMutableAsset, buyer, holderSmartPolicy } =
    //     await loadFixture(deployWalletAsset);
    //   expect(await walletMutableAsset.()).to.be.equal(
    //     "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9"
    //   );
    //   await expect(
    //     walletMutableAsset
    //       .connect(buyer)
    //       .setHolderSmartPolicy(holderSmartPolicy.address)
    //   );
    //   expect(await walletMutableAsset.holderSmartPolicy()).to.be.equal(
    //     "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"
    //   );
    // });
  });
});
