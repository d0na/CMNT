import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTrainTicketAsset } from "../../helpers/trainTicketTest";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("TrainTicketMutableAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { trainTicketNMT, trainTicketMutableAsset } = await deployTrainTicketAsset();
    const nmt = await trainTicketMutableAsset.nmt();
    expect(nmt).to.be.equal(trainTicketNMT.address);
  });

  it("Should retrieve the holderSmartPolicy address", async function () {
    const { trainTicketNMT, trainTicketMutableAsset, denyAllSmartPolicy } =
      await deployTrainTicketAsset();
    const holderSmartPolicyAddress =
      await trainTicketMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(denyAllSmartPolicy.address);
  });

  it("Should retrieve the creatorSmartPolicy address", async function () {
    const { trainTicketNMT, trainTicketMutableAsset, creatorSmartPolicy } =
      await deployTrainTicketAsset();
    const creatorSmartPolicyAddress =
      await trainTicketMutableAsset.creatorSmartPolicy();
    expect(creatorSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the owner of the mutable asset", async function () {
    const { trainTicketMutableAsset, buyer } = await deployTrainTicketAsset();
    const jowner = await trainTicketMutableAsset.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the trainTicket descriptor with default values", async function () {
    const { trainTicketMutableAsset } = await deployTrainTicketAsset();
    const trainTicketDescriptor = await trainTicketMutableAsset.getTrainTicketDescriptor();
    expect(trainTicketDescriptor.length).to.be.equal(10); // attribute numbers
    expect(trainTicketDescriptor["passengerName"]).to.be.equal(''); 
    expect(trainTicketDescriptor["seat"]).to.be.equal(0);  
    expect(trainTicketDescriptor["class"]).to.be.equal(0);  
    expect(trainTicketDescriptor["to"]).to.be.equal(0); 
    expect(trainTicketDescriptor["from"]).to.be.equal(0); 
    expect(trainTicketDescriptor["expireDate"]).to.be.equal(0); 
    expect(trainTicketDescriptor["stampDate"]).to.be.equal(0); 
    expect(trainTicketDescriptor["checkTicketDate"]).to.be.equal(0); 
    expect(trainTicketDescriptor["bikeTransport"]).to.be.equal(false); 
    expect(trainTicketDescriptor["animalTransport"]).to.be.equal(false); 
  });

  it("Should setColor without policy evaluation", async function () {
    const { trainTicketMutableAsset } = await deployTrainTicketAsset();
    const _setColor = await trainTicketMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(trainTicketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should be linked to some other NMT");

  describe("Smart Policies stuff", function () {
    it("Should evaluate successfully an action equal to setColor(1,url)", async function () {
      const { creatorSmartPolicy, creator, trainTicketMutableAsset } =
        await loadFixture(deployTrainTicketAsset);
       expect(
        await creatorSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          trainTicketMutableAsset.address
        )
      ).to.be.equal(true);
    });
    it("Should evaluate successfully an action equal to setColor(1,url) with the DENY ALL policy", async function () {
      const { denyAllSmartPolicy, creator, trainTicketMutableAsset } =
        await loadFixture(deployTrainTicketAsset);
       expect(
        await denyAllSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          trainTicketMutableAsset.address
        )
      ).to.be.equal(false);
    });
  });

  describe("Changing smart policies", function () {
    it("Should be forbidden to change holder smart policy to the non-owner", async function () {
      const { trainTicketMutableAsset, creator, holderSmartPolicy } =
        await loadFixture(deployTrainTicketAsset);
      await expect(
        trainTicketMutableAsset
          .connect(creator)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      ).to.be.rejectedWith("Caller is not the holder");
    });

    it("Should be allowed to change the holder's smart policy to holder", async function () {
      const { trainTicketMutableAsset, holderSmartPolicy, buyer } =
        await loadFixture(deployTrainTicketAsset);
      await trainTicketMutableAsset
        .connect(buyer)
        .setHolderSmartPolicy(holderSmartPolicy.address);
      expect(await trainTicketMutableAsset.holderSmartPolicy()).to.be.equal(
        holderSmartPolicy.address
      );
    });

    it("Should be forbidden to change the creator smart policy ", async function () {
      const { trainTicketMutableAsset, creator, creatorSmartPolicy } =
        await loadFixture(deployTrainTicketAsset);
      await expect(
        trainTicketMutableAsset
          .connect(creator)
          .setCreatorSmartPolicy(creatorSmartPolicy.address)
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    // it("Should be allowed to change the holder's smart policy to holder", async function () {
    //   const { trainTicketMutableAsset, buyer, holderSmartPolicy } =
    //     await loadFixture(deployTrainTicketAsset);
    //   expect(await trainTicketMutableAsset.()).to.be.equal(
    //     "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9"
    //   );
    //   await expect(
    //     trainTicketMutableAsset
    //       .connect(buyer)
    //       .setHolderSmartPolicy(holderSmartPolicy.address)
    //   );
    //   expect(await trainTicketMutableAsset.holderSmartPolicy()).to.be.equal(
    //     "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"
    //   );
    // });
  });
});
