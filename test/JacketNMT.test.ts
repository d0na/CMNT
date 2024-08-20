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

describe("Tests related to JacketNMT", function () {
  describe("Minting-related tests", function () {
    it("Should revert if the minter of the jacket is the 0 address", async function () {
      // valid alternative to ZERO_ADDRESS is ethers.constants.AddressZero
      const { jacketNMT, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);
      expect(
        jacketNMT.mint(ZERO_ADDRESS, creatorSmartPolicy, denyAllSmartPolicy)
      ).to.be.revertedWith("Ownable: new owner is the zero address");
    });

    it("Should be minted a new Jacket and owned", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);
      await jacketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      expect(await jacketNMT.ownerOf(TOKEN_ID1_STRING)).to.equal(owner.address);
    });

    it("Should not be minted because denied by PRINCIPAL Smart Policy (not recognized retailer)", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, account1, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);

      await expect(jacketNMT.connect(account1).mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      )).to.be.rejectedWith(
        "Operation DENIED by PRINCIPAL policy"
      );
    });


    it("Should be minted a new Jacket asset and returned its address and tokenId", async function () {
      const { jacketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID1_STRING,
        assetAddress: ASSET_ADDRESS1,
      };

      const mintResponse = await jacketNMT.callStatic.mint(
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
      const jacketMutableAsset = JacketMutableAsset.deploy(jacketNMT.address, creatorSmartPolicy.address, denyAllSmartPolicy.address);

      expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
      expect(assetAddress).to.equal(Minted.assetAddress);
    });

    it("Should mint new Jacket asset and trigger the Transfer event with the right onwer and tokenId", async function () {
      const { jacketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID1_STRING,
      };

      const txResponse = await jacketNMT.mint(
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

    it("Should mint two Jacket assets, returnig two differents tokenIds but the same owner within the Transfer event", async function () {
      const {
        jacketNMT,
        account1,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployJacketNMT);
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
      const mint1 = await jacketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );
      const mint2 = await jacketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
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

      expect(await jacketNMT.ownerOf(Minted1.tokenId)).to.equal(Minted1.owner);
      expect(await jacketNMT.ownerOf(Minted2.tokenId)).to.equal(Minted1.owner);
    });

    it("Should be named 'Mutable Jacket for a PUB Decentraland UniPi Project'", async function () {
      const { jacketNMT } = await loadFixture(deployJacketNMT);
      expect(await jacketNMT.name()).to.equal(
        "Mutable Jacket for a PUB Decentraland UniPi Project"
      );
    });

    it("Should have symbol named 'PUBMNTJACKET'", async function () {
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

    it("Should mint a new asset with the correct address", async function () {
      const { jacketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
        await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: TOKEN_ID2_STRING,
        assetAddres: ASSET_ADDRESS2,
      };

      await jacketNMT.mint(
        owner.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

      expect(await jacketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
        Minted.assetAddres
      );
    });

    it("Should mint a new asset and retrieves the same owner with getOwner", async function () {
      const {
        jacketNMT,
        owner,
        creatorSmartPolicy,
        account1,
        denyAllSmartPolicy,
      } = await loadFixture(deployJacketNMT);
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
      const mint = await jacketNMT.mint(
        account1.address,
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
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
      // 5. it's verified that the Asset has the same address that it is stored on the NTM
      expect(await jacketMutableAsset.nmt()).to.be.equal(jacketNMT.address);
      // 6. it's verified that the Asset has the same owner that it is stored on the NTM
      expect(await jacketMutableAsset.callStatic.getHolder()).to.be.equal(
        Minted.owner
      );
    });
  });

  describe("Tests related to transferFrom", () => {

    it("Should be minted and transferred but the CreatorSmartPolicylNoTransferAllowed policy should deny it", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        denyAllSmartPolicy,
        creatorSmartPolicyNoTransferAllowed,
      } = await loadFixture(deployJacketNMT);
      const Minted = {
        from: ZERO_ADDRESS,
        firstOwner: owner.address,
        secondOwner: account1.address,
        thirdOwner: account2.address,
        tokenId: TOKEN_ID1_STRING,
      };

      // Minting the NFT to the First Owner
      const mintResponse = await jacketNMT.mint(
        Minted.firstOwner,
        creatorSmartPolicyNoTransferAllowed.address,
        denyAllSmartPolicy.address
      );
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(Minted.from, Minted.firstOwner, Minted.tokenId);

      expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
        Minted.firstOwner
      );

      // Trasfering the NFT to the Second Owner
      await expect(jacketNMT.transferFrom(
        Minted.firstOwner,
        Minted.secondOwner,
        Minted.tokenId
      )).to.be.rejectedWith(
        "Operation DENIED by CREATOR policy"
      );

      // Check that the new owner is not changed
      expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
        Minted.firstOwner
      );
    });


    it("Should be minted and transfered the NFT ownership twice. Then checked through the ownerOf(tokenId) method the correct owner.", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployJacketNMT);
      const FIRSTOWNER = owner.address;
      const SECONDOWNER = account1.address;
      const THIRDOWNER = account2.address;
      const TOKENID = TOKEN_ID1_STRING;

      // Minting the NFT for the First Owner
      const mintResponse = await jacketNMT.mint(
        FIRSTOWNER, //to
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

      // Verifies that the Token is Transfer to the 'to' mint param (FIRST OWNER) 
      await expect(mintResponse)
        .to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(ZERO_ADDRESS, FIRSTOWNER, TOKENID);

      // Verifies the TOKENID owenership for the FIRST Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        FIRSTOWNER
      );

      jacketNMT.approve(account1.address,TOKENID);
      // Trasfering the NFT to the Second Owner
      await expect(jacketNMT.connect(account1).transferFrom(
        FIRSTOWNER, SECONDOWNER, TOKENID
      )).to.emit(jacketNMT, "Transfer")
        // from, to, tokenId
        .withArgs(FIRSTOWNER, SECONDOWNER, TOKENID);;

      // Check that the new owner is changed, verfies the TOKENID owenership for the SECOND Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        SECONDOWNER
      );

      // Trasfering NFT to the Third Owner
      await jacketNMT
        .connect(account1)
        .transferFrom(SECONDOWNER, THIRDOWNER, TOKENID);

      // Check that the new owner is changed, verfies the TOKENID owenership for the THIRD Owner 
      expect(await jacketNMT.ownerOf(TOKENID)).to.be.equal(
        THIRDOWNER
      );
    });

    it("Should mint and transfered jackets until the CreatorSmartPolicy denies the transfer (due to reached limited number of owned jackets: 3)", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        denyAllSmartPolicy,
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
          denyAllSmartPolicy.address
        )).to.emit(jacketNMT, "Transfer")
          .withArgs(Minted.from, Minted.firstOwner, TOKEN_ID_LIST[i]);

        if (i <= 3) {
          // Trasnfer to  account1.address
          await expect(jacketNMT.transferFrom(
            owner.address,
            account1.address,
            TOKEN_ID_LIST[i]
          )).to.emit(jacketNMT, "Transfer")
            .withArgs(owner.address, account1.address, TOKEN_ID_LIST[i]);
        } else {
          // Reached the limit number of owned jacket
          await expect(jacketNMT.transferFrom(
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

  describe("Tests related to safeTransferFrom", () => {

    it("Should be minted and safe-transfered the NFT ownership twice. Then checked through the ownerOf(tokenId) method the correct owner.", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        creatorSmartPolicy,
        denyAllSmartPolicy,
      } = await loadFixture(deployJacketNMT);
      const FIRSTOWNER = owner.address;
      const SECONDOWNER = account1.address;
      const THIRDOWNER = account2.address;
      const TOKENID = TOKEN_ID1_STRING;

      // Minting the NFT for the First Owner
      const mintResponse = await jacketNMT.mint(
        FIRSTOWNER, //to
        creatorSmartPolicy.address,
        denyAllSmartPolicy.address
      );

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

    it("Should mint and safe-transfered jackets until the CreatorSmartPolicy denies the transfer (due to reached limited number of owned jackets: 3)", async function () {
      const {
        jacketNMT,
        owner,
        account1,
        account2,
        denyAllSmartPolicy,
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
          denyAllSmartPolicy.address
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

  describe("Test using the real NFT Protocol", () => {
    it("Minting and transferFrom", async function () {
      const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
      const NFT = await ethers.getContractFactory("NonFungibleToken");
      const nft = await NFT.deploy(creator.address);

      await nft.mintCollectionNFT(creator.address, 1);
      await nft.transferFrom(creator.address, buyer.address, 1);
    });
  });
});
