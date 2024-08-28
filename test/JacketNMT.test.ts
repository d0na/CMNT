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
import { deployJacketNMT } from "../helpers/test";
import * as _ from "../typechain-types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

//const TOKEN_ID1_STRING = "921600849408656576225127304129841157239410643646";
//const TOKEN_ID2_STRING = "1048441399354366663447528331587451327875741636968";

const TOKEN_ID1_STRING = "1158808384137004768675244516077074077445013636396";
const TOKEN_ID2_STRING = "908326538895415626116914244041615655093740059278";


// const ASSET_ADDRESS1 = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
// const ASSET_ADDRESS2 = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
const ASSET_ADDRESS1 = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const ASSET_ADDRESS2 = "0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e";

describe("Jacket NMT tests", function () {

  describe("Minting-related tests", function () {

    it("should revert if the minter of the jacket is the 0 address", async function () {
      // valid alternative to ZERO_ADDRESS is ethers.constants.AddressZero
      const { jacketNMT, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      expect(
        jacketNMT.mint(ZERO_ADDRESS, creatorSmartPolicy, creatorSmartPolicy)
      ).to.be.revertedWith("Ownable: new owner is the zero address");
    });

    it("should a Creator mint and own a new Mutable Asset Jacket", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, owner: creator, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await jacketNMT.mint(
        creator.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      expect(await jacketNMT.ownerOf(TOKEN_ID1_STRING)).to.equal(creator.address);
    });

    it("should a Creator mint a Mutable Asset Jacket for another user (different Holder)", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, owner: creator, account1: holder, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await jacketNMT.mint(
        holder.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      expect(await jacketNMT.ownerOf(TOKEN_ID1_STRING)).to.equal(holder.address);
    });

    it("should mint a new Mutable Asset Jacket and return its contract address and tokenId", async function () {
      const { jacketNMT, owner: creator, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        creator: creator.address,
        tokenId: TOKEN_ID1_STRING,
        assetAddress: ASSET_ADDRESS1,
      };

      // Minting mutable asset by the Creator
      const mintResponse = await jacketNMT.callStatic.mint(
        creator.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      const assetAddress = mintResponse[0];
      const tokenId = mintResponse[1];

      //JacketMutableAsset contract
      const JacketMutableAsset = await ethers.getContractFactory(
        "JacketMutableAsset"
      );
      const jacketMutableAsset = JacketMutableAsset.deploy(jacketNMT.address, creatorSmartPolicy.address, creatorSmartPolicy.address);

      expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
      expect(assetAddress).to.equal(Minted.assetAddress);
    });

    it("should an 'Unrecognized Retailer' unable to mint a Mutable Asset Jacket because denied by the PRINCIPAL Smart Policy", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, account1: unrecognizedRetailer, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);

      await expect(jacketNMT.connect(unrecognizedRetailer).mint(
        unrecognizedRetailer.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      )).to.be.rejectedWith(
        "Operation DENIED by PRINCIPAL policy"
      );
    });

    it("should mint new Mutable Asset Jacket and trigger the Transfer event with the right onwer and tokenId", async function () {
      const { jacketNMT, owner, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const txResponse = await jacketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      const txReceipt = await txResponse.wait();
      const events = txReceipt.events;

      const TransferEvent = events[0].args;
      const tokenId: Number = TransferEvent?.tokenId;

      expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
    });

    it("should mint two Jacket assets, returnig two differents tokenIds but the same owner within the Transfer event", async function () {
      const {
        jacketNMT,
        account1: creator,
        creatorSmartPolicy
      } = await loadFixture(deployJacketNMT);

      const Minted1 = {
        from: ZERO_ADDRESS,
        owner: creator.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const Minted2 = {
        from: ZERO_ADDRESS,
        owner: creator.address,
        tokenId: TOKEN_ID2_STRING,
      };
      const mint1 = await jacketNMT.mint(
        creator.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      const mint2 = await jacketNMT.mint(
        creator.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      const mint2Result = await mint2.wait();
      // console.log("[mint2]: \n - tokenId: %s",mint2Result.events[0].args.tokenId);

      await expect(mint1)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted1.from, Minted1.owner, Minted1.tokenId);

      await expect(mint2)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted2.from, Minted2.owner, Minted2.tokenId);

      expect(await jacketNMT.ownerOf(Minted1.tokenId)).to.equal(creator.address);
      expect(await jacketNMT.ownerOf(Minted2.tokenId)).to.equal(creator.address);
    });

    it("should be named 'Mutable Jacket for a PUB Decentraland UniPi Project'", async function () {
      const { jacketNMT } = await loadFixture(deployJacketNMT);
      expect(await jacketNMT.name()).to.equal(
        "Mutable Jacket for a PUB Decentraland UniPi Project"
      );
    });

    it("should have symbol named 'PUBMNTJACKET'", async function () {
      const { jacketNMT } = await loadFixture(deployJacketNMT);
      expect(await jacketNMT.symbol()).to.equal("PUBMNTJACKET");
    });

    // it("Should have tokenUri 'filename.glb'", async function () {
    //   const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
    //   const Minted = {
    //     owner: owner.address,
    //     tokenId: "921600849408656576225127304129841157239410643646",
    //     uri: "filename.glb",
    //   };

    //   await jacketNMT.mint(owner.address);
    //   expect(
    //     await jacketNMT.ownerOf(
    //       "921600849408656576225127304129841157239410643646"
    //     )
    //   ).to.be.equal(Minted.owner);
    //   expect(
    //     await jacketNMT.tokenURI(
    //       "921600849408656576225127304129841157239410643646"
    //     )
    //   ).to.equal(Minted.uri);
    // });

    it("should mint a new asset with the correct mutable asset contract address", async function () {
      const { jacketNMT, owner, creatorSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID2_STRING,
        assetAddres: ASSET_ADDRESS2,
      };

      await jacketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );

      expect(await jacketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
        Minted.assetAddres
      );
    });

    it("should mint a new asset and retrieves the same owner using the mutable asset getHolder() function", async function () {
      const {
        jacketNMT,
        creatorSmartPolicy,
        account1: creator,
      } = await loadFixture(deployJacketNMT);
      const JacketMutableAsset = await ethers.getContractFactory(
        "JacketMutableAsset"
      );
      const Minted = {
        from: ZERO_ADDRESS,
        owner: creator.address,
        tokenId: TOKEN_ID1_STRING,
        address: ASSET_ADDRESS1,
      };

      // 1. It is minted a new Jacket
      const mint = await jacketNMT.mint(
        creator.address,
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );
      // const jacketAddress = await jacketNMT.getJacketAddress(Minted.tokenId);

      await expect(mint)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted.from, Minted.owner, Minted.tokenId);

      // 2. It is retrieved the jacketAddress from th NMT contract
      expect(await jacketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
        Minted.address
      );
      // 3. It is retrieved the ownerOf(tokeind of the new minted address) from th NMT contract
      expect(await jacketNMT.ownerOf(Minted.tokenId)).to.equal(Minted.owner);
      // 4. A JacektMutableAsset instance is created from its minted address
      const jacketMutableAsset = JacketMutableAsset.attach(Minted.address);
      // 5. it's verified that the Asset has the same address that it is stored on the NMT
      expect(await jacketMutableAsset.nmt()).to.be.equal(jacketNMT.address);
      // 6. it's verified that the Asset has the same owner that it is stored on the NMT
      expect(await jacketMutableAsset.callStatic.getHolder()).to.be.equal(
        Minted.owner
      );
    });
  });

  describe("Tests related to transferFrom", () => {

    it("should mint and transferFrom a mutable asset and set the holderSmartPolicy to Ox", async function () {
      const {
        jacketNMT,
        owner: creator,
        account1,
        account2,
        creatorSmartPolicy,
      } = await loadFixture(deployJacketNMT);

      const MintedAsset = {
        from: ZERO_ADDRESS,
        creator: creator.address,
        account1: account1.address,
        account2: account2.address,
        tokenId: TOKEN_ID1_STRING,
        address: ASSET_ADDRESS1,
      };

      // Minting the NFT by the Creator
      const mintResponse = await jacketNMT.mint(
        MintedAsset.creator, // to
        creatorSmartPolicy.address, // creator smart policy 
        creatorSmartPolicy.address // holder smart policy
      );

      const JacketMutableAsset = await ethers.getContractFactory(
        "JacketMutableAsset"
      );
      const jacketMutableAsset = JacketMutableAsset.attach(MintedAsset.address);

      // Verify all the responsed data
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(MintedAsset.from, MintedAsset.creator, MintedAsset.tokenId);

      // Verify that the Creator is the current holder  
      expect(await jacketNMT.ownerOf(MintedAsset.tokenId)).to.be.equal(
        creator.address
      );

      // Trasfering the NFT to another user (account1)
      await jacketNMT.transferFrom(
        MintedAsset.creator,
        MintedAsset.account1,
        MintedAsset.tokenId
      );

      // Check that the new holder is account1
      expect(await jacketNMT.ownerOf(MintedAsset.tokenId)).to.be.equal(
        account1.address
      );
      // Check that after the transferFrom the holderSmartPolicy is set to 0x 
      expect(await jacketMutableAsset.holderSmartPolicy()).to.be.equal(ZERO_ADDRESS);
    });

    it("should mint and deny the transferFrom by the CreatorSmartPolicylNoTransferAllowed policy", async function () {
      const {
        jacketNMT,
        owner: creator,
        account1,
        account2,
        creatorSmartPolicyNoTransferAllowed,
      } = await loadFixture(deployJacketNMT);
      const Minted = {
        from: ZERO_ADDRESS,
        creator: creator.address,
        account1: account1.address,
        account2: account2.address,
        tokenId: TOKEN_ID1_STRING,
      };

      // Minting the NFT by the Creator
      const mintResponse = await jacketNMT.mint(
        Minted.creator,
        creatorSmartPolicyNoTransferAllowed.address,
        creatorSmartPolicyNoTransferAllowed.address
      );
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted.from, Minted.creator, Minted.tokenId);

      // expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      //   Minted.creator
      // );

      // Trasfering the NFT to the another user (account1)
      await expect(jacketNMT.transferFrom(
        Minted.creator,
        Minted.account1,
        Minted.tokenId
      )).to.be.rejectedWith(
        "Operation DENIED by CREATOR policy"
      );

      // Check that the holder (creator user) is not changed
      expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
        creator.address
      );
    });


    it("should mint a mutable asset then transferFrom the mutable asset ownership twice also delegating (approve) a different user (account1).", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy
      } = await loadFixture(deployJacketNMT);
      const CREATOR = owner.address;
      const ACCOUNT1 = account1.address;
      const ACCOUNT2 = account2.address;
      const TOKENID = TOKEN_ID1_STRING;

      // Minting the NFT by the Creator
      const mintResponse = await jacketNMT.mint(
        CREATOR, //to
        creatorSmartPolicy.address,
        creatorSmartPolicy.address
      );

      // Verifies that the Token is Transfer to the 'to' mint param (FIRST OWNER) 
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(ZERO_ADDRESS, CREATOR, TOKENID);

      // Verifies the TOKENID ownership belongs to the Creator user
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        CREATOR
      );

      // Delegate account1 to do a transferFrom
      await jacketNMT.approve(account1.address, TOKENID);

      // Trasfering the NFT to another user (account1)
      await expect(jacketNMT.connect(account1).transferFrom(
        CREATOR, ACCOUNT1, TOKENID
      )).to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(CREATOR, ACCOUNT1, TOKENID);

      // Check that the new owner is changed, verfies the TOKENID owenership for the second holder (account1)
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        ACCOUNT1
      );

      // Trasfering NFT to the Third holder (account2)
      await jacketNMT
        .connect(account1)
        .transferFrom(ACCOUNT1, ACCOUNT2, TOKENID);

      // Check that the new holder is changed, verfies the TOKENID owenership for the third holder (account2)
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        ACCOUNT2
      );
    });

    it("should mint and transferFrom jackets until the CreatorSmartPolicy denies the transfer (due to reached limited number of owned jackets: 3)", async function () {
      const {
        jacketNMT,
        owner: creator,
        account1,
        account2,
        creatorSmartPolicy,
      } = await loadFixture(deployJacketNMT);
      const Minted = {
        from: ZERO_ADDRESS,
        creator: creator.address,
        account1: account1.address,
        account2: account2.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const TOKEN_ID_LIST = [
        '1158808384137004768675244516077074077445013636396',
        '908326538895415626116914244041615655093740059278',
        '1093979775858064614434340416839704496575080287317',
        '843296899859498528068740589347817885660631960527',
        '925870555928972260054763252142951812295523922115'
      ]
      for (let i = 0; i <= 4; i++) {
        // Mint
        await expect(jacketNMT.mint(
          creator.address,
          creatorSmartPolicy.address,
          creatorSmartPolicy.address
        )).to.emit(jacketNMT, "Transfer")
          .withArgs(Minted.from, Minted.creator, TOKEN_ID_LIST[i]);

        if (i <= 3) {
          // Trasnfer to  account1.address
          await expect(jacketNMT.transferFrom(
            creator.address,
            account1.address,
            TOKEN_ID_LIST[i]
          )).to.emit(jacketNMT, "Transfer")
            .withArgs(creator.address, account1.address, TOKEN_ID_LIST[i]);
        } else {
          // Reached the limit number of owned jacket
          await expect(jacketNMT.transferFrom(
            creator.address,
            account1.address,
            TOKEN_ID_LIST[i]
          )).to.be.rejectedWith(
            "Operation DENIED by CREATOR policy"
          );
        }
      }
    });
  });

  describe("Tests related to safeTransferFrom", () => {

    it("should mint and safe-transfer the NMT ownership twice.", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy
      } = await loadFixture(deployJacketNMT);
      const FIRSTOWNER = owner.address;
      const SECONDOWNER = account1.address;
      const THIRDOWNER = account2.address;
      const TOKENID = TOKEN_ID1_STRING;

      // Minting the NFT for the First Owner
      const mintResponse = await jacketNMT.mint(
        FIRSTOWNER, //to
        creatorSmartPolicy.address,creatorSmartPolicy.address);

      // Verifies that the Token is Transfer to the 'to' mint param (FIRST OWNER) 
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(ZERO_ADDRESS, FIRSTOWNER, TOKENID);

      // Verifies the TOKENID owenership for the FIRST Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        FIRSTOWNER
      );

      // Trasfering the NFT to the Second Owner
      await expect((jacketNMT as _.JacketNMT)["safeTransferFrom(address,address,uint256)"](
        FIRSTOWNER, SECONDOWNER, TOKENID
      )).to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(FIRSTOWNER, SECONDOWNER, TOKENID);;

      // Check that the new owner is changed, verfies the TOKENID owenership for the SECOND Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        SECONDOWNER
      );

      // Trasfering NFT to the Third Owner
      await (jacketNMT as _.JacketNMT)
        .connect(account1)["safeTransferFrom(address,address,uint256)"](SECONDOWNER, THIRDOWNER, TOKENID);

      // Check that the new owner is changed, verfies the TOKENID owenership for the THIRD Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        THIRDOWNER
      );
    });

    it("should mint and safe-transfered jackets until the CreatorSmartPolicy denies the transfer (due to reached limited number of owned jackets: 3)", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
      } = await loadFixture(deployJacketNMT);
      const Minted = {
        from: ZERO_ADDRESS,
        firstOwner: owner.address,
        secondOwner: account1.address,
        thirdOwner: account2.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const TOKEN_ID_LIST = [
        '1158808384137004768675244516077074077445013636396',
        '908326538895415626116914244041615655093740059278',
        '1093979775858064614434340416839704496575080287317',
        '843296899859498528068740589347817885660631960527',
        '925870555928972260054763252142951812295523922115'
      ]
      for (let i = 0; i <= 4; i++) {
        // Mint
        await expect(jacketNMT.mint(
          owner.address,
          creatorSmartPolicy.address,
          creatorSmartPolicy.address
        )).to.emit(jacketNMT, "Transfer")
          .withArgs(Minted.from, Minted.firstOwner, TOKEN_ID_LIST[i]);

        if (i <= 3) {
          // Trasnfer to  account1.address
          await expect((jacketNMT as _.JacketNMT)["safeTransferFrom(address,address,uint256)"](
            owner.address,
            account1.address,
            TOKEN_ID_LIST[i]
          )).to.emit(jacketNMT, "Transfer")
            .withArgs(owner.address, account1.address, TOKEN_ID_LIST[i]);
        } else {
          // Reached the limit number of owned jacket
          await expect((jacketNMT as _.JacketNMT)["safeTransferFrom(address,address,uint256)"](
            owner.address,
            account1.address,
            TOKEN_ID_LIST[i]
          )).to.be.rejectedWith(
            "Operation DENIED by CREATOR policy"
          );
        }
      }
    });
  });

  describe("Test using the real NFT ERC-721 Protocol ", () => {
    it("should mint and transferFrom", async function () {
      const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
      const NFT = await ethers.getContractFactory("NonFungibleToken");
      const nft = await NFT.deploy(creator.address);

      await nft.mintCollectionNFT(creator.address, 1);
      await nft.transferFrom(creator.address, buyer.address, 1);
    });
  });
});
