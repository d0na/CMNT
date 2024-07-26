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
import { BigNumber } from "ethers";
import { deployEventTicketNMT } from "../helpers/eventTicketTest.helper";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// const TOKEN_ID1_STRING = "921600849408656576225127304129841157239410643646";
const TOKEN_ID1_STRING = "1158808384137004768675244516077074077445013636396";
const TOKEN_ID2_STRING = "908326538895415626116914244041615655093740059278";
// const TOKEN_ID2_STRING = "1048441399354366663447528331587451327875741636968";

// const ASSET_ADDRESS1 = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
const ASSET_ADDRESS1 = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
// const ASSET_ADDRESS2 = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
const ASSET_ADDRESS2 = "0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e";
describe("eventTicketNMT", function () {
  describe("Test the mint method", () => {
    it("Should revert if the miner is 0 address", async function () {
      // valid alternative to ZERO_ADDRESS is
      // ethers.constants.AddressZero
      const { eventTicketNMT, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployEventTicketNMT);
      expect(
        eventTicketNMT.mint(ZERO_ADDRESS, creatorSmartPolicy, denyAllSmartPolicy)
      ).to.be.revertedWith("Ownable: new owner is the zero address");
    });

    it("Should be minted and owned", async function () {
      // valid alternative ethers.constants.AddressZero
      const { eventTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployEventTicketNMT);
      await eventTicketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

      expect(await eventTicketNMT.owner()).to.equal(owner.address);
    });

    it("Should mint a new asset and return its address and tokenId", async function () {
      const { eventTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployEventTicketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID1_STRING,
        assetAddress: ASSET_ADDRESS1,
      };

      const mintResponse = await eventTicketNMT.callStatic.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      const assetAddress = mintResponse[0];
      const tokenId = mintResponse[1];


      //JacketMutableAsset
      const JacketMutableAsset = await ethers.getContractFactory(
        "JacketMutableAsset"
      );
      const jacketMutableAsset = JacketMutableAsset.deploy(eventTicketNMT.address, creatorSmartPolicy.address, denyAllSmartPolicy.address);

      expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
      expect(assetAddress).to.equal(Minted.assetAddress);
    });

    it("Should mint new asset and trigger the Transfer event with the right onwer and tokenId", async function () {
      const { eventTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployEventTicketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const txResponse = await eventTicketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      const txReceipt = await txResponse.wait();

      const events = txReceipt.events;

      const TransferEvent = events[0].args;
      const tokenId: Number = TransferEvent?.tokenId;

      expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
    });

    it("Should mint two assets with two differents tokenIds and the same owner within the Transfer event", async function () {
      const {
        eventTicketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployEventTicketNMT);
      const Minted1 = {
        from: ZERO_ADDRESS,
        owner: account1.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const Minted2 = {
        from: ZERO_ADDRESS,
        owner: account1.address,
        tokenId: TOKEN_ID2_STRING,
      };
      const mint1 = await eventTicketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      const mint2 = await eventTicketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

      await expect(mint1)
        .to.emit(eventTicketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted1.from, Minted1.owner, Minted1.tokenId);

      await expect(mint2)
        .to.emit(eventTicketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted2.from, Minted2.owner, Minted2.tokenId);

      expect(await eventTicketNMT.ownerOf(Minted1.tokenId)).to.equal(Minted1.owner);
      expect(await eventTicketNMT.ownerOf(Minted2.tokenId)).to.equal(Minted1.owner);
    });

    it("Should be named 'Mutable Jacket for a PUB Decentraland UniPi Project'", async function () {
      const { eventTicketNMT } = await loadFixture(deployEventTicketNMT);
      expect(await eventTicketNMT.name()).to.equal(
        "Mutable EventTicket UniPi Project"
      );
    });

    it("Should have symbol named 'TICKETNMT'", async function () {
      const { eventTicketNMT } = await loadFixture(deployEventTicketNMT);
      expect(await eventTicketNMT.symbol()).to.equal("TICKETNMT");
    });

    // it("Should have tokenUri 'filename.glb'", async function () {
    //   const { eventTicketNMT, owner } = await loadFixture(deployEventTicketNMT);
    //   const Minted = {
    //     owner: owner.address,
    //     tokenId: "921600849408656576225127304129841157239410643646",
    //     uri: "filename.glb",
    //   };

    //   await eventTicketNMT.mint(owner.address);
    //   expect(
    //     await eventTicketNMT.ownerOf(
    //       "921600849408656576225127304129841157239410643646"
    //     )
    //   ).to.be.equal(Minted.owner);
    //   expect(
    //     await eventTicketNMT.tokenURI(
    //       "921600849408656576225127304129841157239410643646"
    //     )
    //   ).to.equal(Minted.uri);
    // });

    it("Should mint a new asset with the right address", async function () {
      const { eventTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployEventTicketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID2_STRING,
        assetAddres: ASSET_ADDRESS2,
      };

      await eventTicketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

      expect(await eventTicketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
        Minted.assetAddres
      );
    });

    it("Should mint a new asset and retrieves the same owner with getOwner", async function () {
      const {
        eventTicketNMT,
        owner,
        creatorSmartPolicy,
        account1,
        denyAllSmartPolicy,
      } = await loadFixture(deployEventTicketNMT);
      const JacketMutableAsset = await ethers.getContractFactory(
        "JacketMutableAsset"
      );
      const Minted = {
        from: ZERO_ADDRESS,
        owner: account1.address,
        tokenId: TOKEN_ID1_STRING,
        address: ASSET_ADDRESS1,
      };

      // 1. It is minted a new Jacket
      const mint = await eventTicketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      // const jacketAddress = await eventTicketNMT.getJacketAddress(Minted.tokenId);

      await expect(mint)
        .to.emit(eventTicketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted.from, Minted.owner, Minted.tokenId);

      // 2. It is retrieved the jacketAddress from th NMT contract
      expect(await eventTicketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
        Minted.address
      );
      // 3. It is retrieved the ownerOf(tokeind of the new minted address) from th NMT contract
      expect(await eventTicketNMT.ownerOf(Minted.tokenId)).to.equal(Minted.owner);
      // 4. A JacektMutableAsset instance is created from its minted address
      const jacketMutableAsset = JacketMutableAsset.attach(Minted.address);
      // 5. it's verified that the Asset has the same address that it is stored on the NTM
      expect(await jacketMutableAsset.nmt()).to.be.equal(eventTicketNMT.address);
      // 6. it's verified that the Asset has the same owner that it is stored on the NTM
      expect(await jacketMutableAsset.callStatic.getHolder()).to.be.equal(
        Minted.owner
      );
    });

    //
    //   it("Should be owned by the owner associated with the TokenId", async function () {
    //     const { eventTicketNMT, owner } = await loadFixture(deployEventTicketNMT);
    //     const Minted = {
    //       owner: owner.address,
    //       tokenId: "921600849408656576225127304129841157239410643646",
    //       uri: "filename.glb",
    //     };

    //     await eventTicketNMT.mint(owner.address);
    //     expect(
    //       await eventTicketNMT.ownerOf(
    //         "921600849408656576225127304129841157239410643646"
    //       )
    //     ).to.be.equal(Minted.owner);
    //   });

    it("[Rule B] Should mint items until it reaches the max minted limit number (10) and he is recognized, then should be denied by the Principal Policy", async function () {
      const {
        eventTicketNMT,
        owner,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployEventTicketNMT);


      for (let i = 0; i <= 10; i++) {
        eventTicketNMT.mint(
          owner.address,
          creatorSmartPolicy.address,
          denyAllSmartPolicy.address
        );
      }
      await expect(eventTicketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      )).to.be.rejectedWith(
        "Operation DENIED by PRINCIPAL policy"
      );
    });

    it("[Rule B] Should not mint because who is minting is not recognized as valid user and the operaion is denied by the Principal Policy", async function () {
      const {
        eventTicketNMT,
        owner,
        creatorSmartPolicy,
        denyAllSmartPolicy,account2
      } = await loadFixture(deployEventTicketNMT);


      await expect(eventTicketNMT.connect(account2).mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      )).to.be.rejectedWith(
        "Operation DENIED by PRINCIPAL policy"
      );
    });
  });

  describe("Tests transferFrom and paybleTransferFrom", () => {

    it("Should mint a new item and then not Transfered using the payableTransferFrom method by paying 105 founds that are not allowed by CSP ", async function () {
      const {
        eventTicketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployEventTicketNMT);

      // const Minted = {
      //   from: ZERO_ADDRESS,
      //   firstOwner: owner.address,
      //   secondOwner: account1.address,
      //   thirdOwner: account2.address,
      //   tokenId: '1158808384137004768675244516077074077445013636396',
      // };


      const CREATOR = owner.address;
      const BUYER = account1.address;
      const NEW_OWNER = account2.address;
      const TOKENID = "1158808384137004768675244516077074077445013636396";

      eventTicketNMT.mint(
        CREATOR,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      )

      expect(await eventTicketNMT.ownerOf(TOKENID)).to.be.eq(CREATOR);
      // Transfer to  account1.address
      await expect(eventTicketNMT.payableTransferFrom(
        CREATOR,
        BUYER,
        TOKENID,
        { value: 105 }
      )).to.be.rejectedWith(
        "Operation DENIED by CREATOR policy"
      );
    });


    it("Should be minted and  Transfered using the payableTransferFrom method by paying  99 founds ", async function () {
      const {
        eventTicketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployEventTicketNMT);


      const CREATOR = owner.address;
      const BUYER = account1.address;
      const NEW_OWNER = account2.address;
      const TOKENID = "1158808384137004768675244516077074077445013636396";

      eventTicketNMT.mint(
        CREATOR,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      )

      // Transfer to  account1.address
      await expect(eventTicketNMT.payableTransferFrom(
        CREATOR,
        BUYER,
        TOKENID,
        { value: 70 }
      )).to.emit(eventTicketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(CREATOR, BUYER, TOKENID);
    });
  });



  //   it("Should be minted and tansfer to a different user (Account1) and visible in the Transfer event", async function () {
  //     const { eventTicketNMT, owner, account1 } = await loadFixture(deployEventTicketNMT);
  //     const Minted = {
  //       owner: owner.address,
  //       tokenId: 921600849408656576225127304129841157239410643646,
  //     };

  //     // minting NFT
  //     const mintResponse = await eventTicketNMT.mint(owner.address);
  //     const mintReceipt = await mintResponse.wait();
  //     // Trasfering NFT to Account1
  //     const transferFromResponse = await eventTicketNMT.transferFrom(
  //       Minted.owner,
  //       account1.address,
  //       "921600849408656576225127304129841157239410643646"
  //     );
  //     // Extracing Transfer Event information
  //     const transferFromReceipt = await transferFromResponse.wait();
  //     const transferFromEventList = transferFromReceipt.events;
  //     const transferEventList = transferFromEventList.filter(
  //       (e: { event: string }) => e.event === "Transfer"
  //     );
  //     const transferEvent = transferEventList[0];
  //     const { from: previousOwner, to: newOwner, tokenId } = transferEvent.args;

  //     expect(newOwner).to.equal(account1.address);
  //     expect(previousOwner).to.equal(Minted.owner);
  //     expect(Number(tokenId)).to.equal(Minted.tokenId);
  //   });

  //   it("Should have asset with model3d equals to ... ", async function () {
  //     const { jacketAsset, owner, account1 } = await loadFixture(
  //       deployEventTicketNMT
  //     );
  //     expect(await jacketAsset.model3d()).to.equal("redJacket");
  //   });

  //   // it("Should fail if the unlockTime is not in the future", async function () {
  //   //   // We don't use the fixture here because we want a different deployment
  //   //   const latestTime = await time.latest();
  //   //   const Lock = await ethers.getContractFactory("Lock");
  //   //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //   //     "Unlock time should be in the future"
  //   //   );
  //   // });

});
