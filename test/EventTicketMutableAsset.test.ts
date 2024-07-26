import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployEventTicketAsset } from "../helpers/eventTicketTest.helper";

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
    const { eventTicketNMT, eventTicketMutableAsset, holderSmartPolicy } =
      await deployEventTicketAsset();
    const holderSmartPolicyAddress =
      await eventTicketMutableAsset.holderSmartPolicy();
    expect(holderSmartPolicyAddress).to.be.equal(holderSmartPolicy.address);
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
    expect(eventTicketDescriptor.length).to.be.equal(7); // attribute numbers
    expect(eventTicketDescriptor["seatNumber"]).to.be.equal(0);
    expect(eventTicketDescriptor["expireDate"]).to.be.equal(0);
    expect(eventTicketDescriptor["validationDate"]).to.be.equal(0);
    expect(eventTicketDescriptor["backstageAccess"]).to.be.equal(false);
    expect(eventTicketDescriptor["virtualSwagBagAccess"]).to.be.equal(false);
    // expect(eventTicketDescriptor["eventItem"]).to.be.equal(undefined);
    // expect(eventTicketDescriptor["virtualSwagBag"]).to.be.equal(undefined);
  });

  xit("Should invoke and perform _setBikeTransport without policy evaluation", async function () {
    const { eventTicketMutableAsset } = await deployEventTicketAsset();
    const _setBikeTransport = await eventTicketMutableAsset._setBikeTransport(true, "test");
    // let receipt = await _setBikeTransport.wait();
    // console.log(receipt.events?.filter((x: any) => { return x.event == "StateChanged" }));
    // for (const event of receipt.events) {
    //   console.log(`Event ${event.event} with args ${event.args}`);
    // }
    const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
    expect(eventTicketDescriptor["bikeTransport"]).to.be.equal(true);
  });

  xit("Should be linked to some other NMT");

  describe("Smart Policies stuff", function () {
    describe("[RULE C] - setSeat ", function () {
      xit("Should setBikeTransport because the subject is allowed by the Smart policies", async function () {
        const { eventTicketMutableAsset, account1 } = await deployEventTicketAsset();
        const setBikeTransport = await eventTicketMutableAsset.connect(account1).setBikeTransport(true, "test");
        const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["bikeTransport"]).to.be.equal(true);
      });

      xit("Should not setBikeTransport because the subject is not allowed by the Smart policies", async function () {
        const { eventTicketMutableAsset, account2 } = await deployEventTicketAsset();
        await expect(
          eventTicketMutableAsset.connect(account2).setBikeTransport(true, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });
      it("Should an event organizer change the seatNumber", async function () {
        const { eventTicketMutableAsset, account3 } = await deployEventTicketAsset();
        const setBikeTransport = await eventTicketMutableAsset.connect(account3).setSeat(111, "test");
        const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["seatNumber"]).to.be.equal(111);
      });

      it("Shouldn’t a non-event organizer change the seat number, operation denied by the CREATOR SMART policy", async function () {
        const { eventTicketMutableAsset, account2 } = await deployEventTicketAsset();
        await expect(
          eventTicketMutableAsset.connect(account2).setSeat(111, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });
    });
    describe("[RULE D] - setBackStageAccess ", function () {

      it("Should the owner set the backstage access to true becasuse he has the PremiumRole and the seatNumber is < 100 ", async function () {
        const { eventTicketMutableAsset, buyer, account3 } = await deployEventTicketAsset();
        await eventTicketMutableAsset.connect(account3).setSeat(99, "test");
        await eventTicketMutableAsset.connect(buyer).setBackstageAccess(true, "test");
        const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["backstageAccess"]).to.be.equal(true);
      });

      it("Shouldn't the owner set the backstage access to true becasuse he has not the PremiumRole, op denied by the CREATOR SMART POLICY ", async function () {
        const { eventTicketMutableAsset, buyer, account1, eventTicketNMT, eventTicketTokenId } = await deployEventTicketAsset();
        await eventTicketNMT.connect(buyer).transferFrom(buyer.address, account1.address, eventTicketTokenId);
        await expect(
          eventTicketMutableAsset.connect(account1).setBackstageAccess(true, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });

      it("Shouldn't the owner set the backstage access to true becasuse the seat number is > than 100, op denied by the CREATOR SMART POLICY ", async function () {
        const { eventTicketMutableAsset, buyer, account3 } = await deployEventTicketAsset();
        await eventTicketMutableAsset.connect(account3).setSeat(105, "test");
        await expect(eventTicketMutableAsset.connect(buyer).setBackstageAccess(true, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });
    });

    describe("[RULE F] - setValidationDate ", function () {

      it("Should an user validate the ticket beacuse he is authorized due to the Logist Support Role", async function () {
        const { eventTicketMutableAsset, buyer } = await deployEventTicketAsset();
        await eventTicketMutableAsset.connect(buyer).setValidationDate(111111, "test");
        const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["validationDate"]).to.be.equal(111111);
      });

      it("Shouldn't the user be able to validate the ticket because he has not the Logist Support Role", async function () {
        const { eventTicketMutableAsset, account1 } = await deployEventTicketAsset();
        await expect(eventTicketMutableAsset.connect(account1).setValidationDate(111111, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });
    });

    xit("Should evaluate successfully an action equal to setColor(1,url)", async function () {
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
    describe("[RULE E] - setVirtualSwagBagAccess ", function () {

      it("Should a Logist Support User set the virtual swag bag access to true", async function () {
        const { eventTicketMutableAsset, buyer } = await deployEventTicketAsset();
        await eventTicketMutableAsset.connect(buyer).setVirtualSwagBagAccess(true, "test");
        const eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["virtualSwagBagAccess"]).to.be.equal(true);
      });

      it("Shouldn't a non-Logist Support User set the virtual swag bag access to true", async function () {
        const { eventTicketMutableAsset, account1 } = await deployEventTicketAsset();
        await expect(eventTicketMutableAsset.connect(account1).setVirtualSwagBagAccess(true, "test")
        ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });

      it("Should a Logist Support User set a virtual swag bag after that the owner claims the virtual swag bag", async function () {
        const { eventTicketMutableAsset, buyer } = await deployEventTicketAsset();
        await eventTicketMutableAsset.connect(buyer).setVirtualSwagBagAccess(true, "test");
        let eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["virtualSwagBagAccess"]).to.be.equal(true);
        await eventTicketMutableAsset.connect(buyer).setVirtualSwagBag(123456, "test");
        eventTicketDescriptor = await eventTicketMutableAsset.getEventTicketDescriptor();
        expect(eventTicketDescriptor["virtualSwagBag"]).to.be.equal(123456);
      });

      it("Shouldn't a Logist Support User set a virtual swag bag because the setVirtualSwagBagAccess is false", async function () {
        const { eventTicketMutableAsset, account1 } = await deployEventTicketAsset();
        await expect(eventTicketMutableAsset.connect(account1).setVirtualSwagBag(1234, "test")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
      });
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
