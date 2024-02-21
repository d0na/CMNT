import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployEventTicketAsset } from "../../helpers/eventTicketTest";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("EventTicketMutableAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Should retrieve the NMT (class) smart contract address", async function () {
    const { eventTicketNMT, eventTicketMutableAsset } = await deployEventTicketAsset();
    const nmt = await eventTicketMutableAsset.nmt();
    expect(nmt).to.be.equal(eventTicketNMT.address);
  });

  it("Should retrieve the holderSmartPolicy address", async function () {
    const { eventTicketNMT, eventTicketMutableAsset, denyAllSmartPolicy } =
      await deployEventTicketAsset();
    const holderSmartPolicyAddress =
      await eventTicketMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(denyAllSmartPolicy.address);
  });

  it("Should retrieve the creatorSmartPolicy address", async function () {
    const { eventTicketNMT, eventTicketMutableAsset, creatorSmartPolicy } =
      await deployEventTicketAsset();
    const creatorSmartPolicyAddress =
      await eventTicketMutableAsset.creatorSmartPolicy();
    expect(creatorSmartPolicyAddress).to.be.equal(creatorSmartPolicy.address);
  });

  it("Should retrieve the owner of the mutable asset", async function () {
    const { eventTicketMutableAsset, buyer } = await deployEventTicketAsset();
    const jowner = await eventTicketMutableAsset.getHolder();
    expect(jowner).to.be.equal(buyer.address);
  });

  it("Should retrieve the eventTicket descriptor with default values", async function () {
    const { eventTicketMutableAsset } = await deployEventTicketAsset();
    const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
    expect(eventTicketDescriptor.length).to.be.equal(10); // attribute numbers
    expect(eventTicketDescriptor["passengerName"]).to.be.equal(''); 
    expect(eventTicketDescriptor["seat"]).to.be.equal(0);  
    expect(eventTicketDescriptor["class"]).to.be.equal(0);  
    expect(eventTicketDescriptor["to"]).to.be.equal(0); 
    expect(eventTicketDescriptor["from"]).to.be.equal(0); 
    expect(eventTicketDescriptor["expireDate"]).to.be.equal(0); 
    expect(eventTicketDescriptor["stampDate"]).to.be.equal(0); 
    expect(eventTicketDescriptor["checkTicketDate"]).to.be.equal(0); 
    expect(eventTicketDescriptor["bikeTransport"]).to.be.equal(false); 
    expect(eventTicketDescriptor["animalTransport"]).to.be.equal(false); 
  });

  it("Should setColor without policy evaluation", async function () {
    const { eventTicketMutableAsset } = await deployEventTicketAsset();
    const _setColor = await eventTicketMutableAsset._setColor(1, "green");
    await expect(_setColor)
      .to.emit(eventTicketMutableAsset, "StateChanged")
      // from, to, tokenId
      .withArgs([1, false]);
  });

  xit("Should be linked to some other NMT");

  describe("Smart Policies stuff", function () {
    it("Should evaluate successfully an action equal to setColor(1,url)", async function () {
      const { creatorSmartPolicy, creator, eventTicketMutableAsset } =
        await loadFixture(deployEventTicketAsset);
       expect(
        await creatorSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          eventTicketMutableAsset.address
        )
      ).to.be.equal(true);
    });
    it("Should evaluate successfully an action equal to setColor(1,url) with the DENY ALL policy", async function () {
      const { denyAllSmartPolicy, creator, eventTicketMutableAsset } =
        await loadFixture(deployEventTicketAsset);
       expect(
        await denyAllSmartPolicy.evaluate(
          creator.address,
          "0xa44b6b74000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000005677265656e000000000000000000000000000000000000000000000000000000",
          eventTicketMutableAsset.address
        )
      ).to.be.equal(false);
    });
  });

  describe("Changing smart policies", function () {
    it("Should be forbidden to change holder smart policy to the non-owner", async function () {
      const { eventTicketMutableAsset, creator, holderSmartPolicy } =
        await loadFixture(deployEventTicketAsset);
      await expect(
        eventTicketMutableAsset
          .connect(creator)
          .setHolderSmartPolicy(holderSmartPolicy.address)
      ).to.be.rejectedWith("Caller is not the holder");
    });

    it("Should be allowed to change the holder's smart policy to holder", async function () {
      const { eventTicketMutableAsset, holderSmartPolicy, buyer } =
        await loadFixture(deployEventTicketAsset);
      await eventTicketMutableAsset
        .connect(buyer)
        .setHolderSmartPolicy(holderSmartPolicy.address);
      expect(await eventTicketMutableAsset.holderSmartPolicy()).to.be.equal(
        holderSmartPolicy.address
      );
    });

    it("Should be forbidden to change the creator smart policy ", async function () {
      const { eventTicketMutableAsset, creator, creatorSmartPolicy } =
        await loadFixture(deployEventTicketAsset);
      await expect(
        eventTicketMutableAsset
          .connect(creator)
          .setCreatorSmartPolicy(creatorSmartPolicy.address)
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    // it("Should be allowed to change the holder's smart policy to holder", async function () {
    //   const { eventTicketMutableAsset, buyer, holderSmartPolicy } =
    //     await loadFixture(deployEventTicketAsset);
    //   expect(await eventTicketMutableAsset.()).to.be.equal(
    //     "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9"
    //   );
    //   await expect(
    //     eventTicketMutableAsset
    //       .connect(buyer)
    //       .setHolderSmartPolicy(holderSmartPolicy.address)
    //   );
    //   expect(await eventTicketMutableAsset.holderSmartPolicy()).to.be.equal(
    //     "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"
    //   );
    // });
  });
});
