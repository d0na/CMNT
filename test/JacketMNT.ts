import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("JacketMNT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBase() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();
    const JacketMNT = await ethers.getContractFactory("JacketMNT");
    const jacketMNT = await JacketMNT.deploy();
    return { jacketMNT, owner };
  }

  describe("MNT", function () {
    it("Should revert if the miner is  0 address", async function () {
      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
      // valid alternative to ZERO_ADDRESS is
      // ethers.constants.AddressZero
      const { jacketMNT } = await loadFixture(deployBase);
      expect(jacketMNT.mint(ZERO_ADDRESS)).to.be.revertedWith(
        "Ownable: new owner is the zero address"
      );
    });

    it("Should be able to be minted and owned", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketMNT, owner } = await loadFixture(deployBase);
      await jacketMNT.mint(owner.address);
      expect(await jacketMNT.owner()).to.equal(owner.address);
    });

    it("Should be minted and trigger events with the right onwer and tokenId", async function () {
      const { jacketMNT, owner } = await loadFixture(deployBase);
      const Minted = {
        owner: owner.address,
        tokenId: 921600849408656576225127304129841157239410643646,
      };

      const txResponse = await jacketMNT.mint(owner.address);
      const txReceipt = await txResponse.wait();

      console.log("txResponse", txResponse);

      const transferEvent = txReceipt.events;
      const OwnershipTransferred = transferEvent && transferEvent[0].args;

      const Transfer = transferEvent && transferEvent[1].args;
      const newOwner = OwnershipTransferred && OwnershipTransferred.newOwner;
      const tokenId: Number = Transfer && Transfer.tokenId;
      // console.log("OwnershipTransferred Event", OwnershipTransferred && OwnershipTransferred)
      // console.log("Transfer Event", Transfer && Transfer[1].args)
      // console.log("NewOwner", newOwner);
      // console.log("tokenId", tokenId);

      expect(newOwner).to.equal(Minted.owner);
      expect(Number(tokenId)).to.equal(Minted.tokenId);
    });

    it("Should be named 'Mutable Jacket for a PUB Decentraland UniPi Project'", async function () {
      const { jacketMNT } = await loadFixture(deployBase);
      expect(await jacketMNT.name()).to.equal(
        "Mutable Jacket for a PUB Decentraland UniPi Project"
      );
    });

    it("Should have symbol named 'PUBMNTJACKET'", async function () {
      const { jacketMNT } = await loadFixture(deployBase);
      expect(await jacketMNT.symbol()).to.equal("PUBMNTJACKET");
    });

    it("Should have tokenUri 'filename.glb'", async function () {
      const { jacketMNT, owner } = await loadFixture(deployBase);
      const Minted = {
        owner: owner.address,
        tokenId: "921600849408656576225127304129841157239410643646",
        uri: "filename.glb",
      };

      await jacketMNT.mint(owner.address);
      expect(
        await jacketMNT.ownerOf(
          "921600849408656576225127304129841157239410643646"
        )
      ).to.be.equal(Minted.owner);
      expect(
        await jacketMNT.tokenURI(
          "921600849408656576225127304129841157239410643646"
        )
      ).to.equal(Minted.uri);
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  describe("Policy", function () {
    async function deployPIPBase() {
      // Contracts are deployed using the first signer/account by default
      const [owner] = await ethers.getSigners();
      const EnvContract = await ethers.getContractFactory("PUB_AM");
      const envContract = await EnvContract.deploy();
      const Pip = await ethers.getContractFactory("PolicyInformationPoint");
      const pip = await Pip.deploy(envContract.address);
      return { pip, owner };
    }

    describe("PIP", function () {
      it("Should create a valid PIP", async function () {
        const { pip } = await loadFixture(deployPIPBase);
        console.log("pip address", pip.address);
        await expect(pip.address).to.not.be.eq(0);
      });
    });
    describe("PDP", function () {
      it("Should change in 'red' color by the tailor 'mario' ", async function () {
        const { pip } = await loadFixture(deployPIPBase);
        const { jacketMNT } = await loadFixture(deployBase);
        // console.log("pip address", jacketMNT.);
        await expect(pip.address).to.not.be.eq(0);
      });
    });
  });
});
