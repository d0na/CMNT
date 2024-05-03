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
import { deployTrainTicketNMT } from "../../helpers/trainTicketTest";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const TOKEN_ID1_STRING = "921600849408656576225127304129841157239410643646";
const TOKEN_ID2_STRING = "1048441399354366663447528331587451327875741636968";

const ASSET_ADDRESS1 = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
const ASSET_ADDRESS2 = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";

describe("trainTicketNMT", function () {
  
  it("Should revert if the miner is 0 address", async function () {
    // valid alternative to ZERO_ADDRESS is
    // ethers.constants.AddressZero
    const { trainTicketNMT, creatorSmartPolicy, denyAllSmartPolicy } =
      await loadFixture(deployTrainTicketNMT);
    expect(
      trainTicketNMT.mint(ZERO_ADDRESS, creatorSmartPolicy, denyAllSmartPolicy)
    ).to.be.revertedWith("Ownable: new owner is the zero address");
  });

  it("Should mint and own", async function () {
    // valid alternative ethers.constants.AddressZero
    const { trainTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
      await loadFixture(deployTrainTicketNMT);
    await trainTicketNMT.mint(
      owner.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );
    expect(await trainTicketNMT.owner()).to.equal(owner.address);
  });

  it("Should mint a new asset and return its address and tokenId", async function () {
    const { trainTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
      await loadFixture(deployTrainTicketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID1_STRING,
      assetAddress: ASSET_ADDRESS1,
    };

    const mintResponse = await trainTicketNMT.callStatic.mint(
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
    const jacketMutableAsset = JacketMutableAsset.deploy(trainTicketNMT.address,creatorSmartPolicy.address,denyAllSmartPolicy.address);
  
    console.log(jacketMutableAsset.address)
    expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
    expect(assetAddress).to.equal(Minted.assetAddress);
  });

  it("Should mint new asset and trigger the Transfer event with the right onwer and tokenId", async function () {
    const { trainTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
      await loadFixture(deployTrainTicketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID1_STRING,
    };

    const txResponse = await trainTicketNMT.mint(
      owner.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );
    const txReceipt = await txResponse.wait();
    console.log("aaa");

    const events = txReceipt.events;

    const TransferEvent = events[0].args;
    const tokenId: Number = TransferEvent?.tokenId;

    expect(Number(tokenId)).to.equal(Number(Minted.tokenId));
  });

  it("Should mint two assets with two differents tokenIds and the same owner within the Transfer event", async function () {
    const {
      trainTicketNMT,
      owner,
      account1,
      account2,
      creatorSmartPolicy,
      denyAllSmartPolicy,
    } = await loadFixture(deployTrainTicketNMT);
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
    const mint1 = await trainTicketNMT.mint(
      account1.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );
    const mint2 = await trainTicketNMT.mint(
      account1.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );

    await expect(mint1)
      .to.emit(trainTicketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted1.from, Minted1.owner, Minted1.tokenId);

    await expect(mint2)
      .to.emit(trainTicketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted2.from, Minted2.owner, Minted2.tokenId);

    expect(await trainTicketNMT.ownerOf(Minted1.tokenId)).to.equal(Minted1.owner);
    expect(await trainTicketNMT.ownerOf(Minted2.tokenId)).to.equal(Minted1.owner);
  });

  it("Should be named 'Mutable Jacket for a PUB Decentraland UniPi Project'", async function () {
    const { trainTicketNMT } = await loadFixture(deployTrainTicketNMT);
    expect(await trainTicketNMT.name()).to.equal(
      "Mutable TrainTicket UniPi Project"
    );
  });

  it("Should have symbol named 'PUBMNTJACKET'", async function () {
    const { trainTicketNMT } = await loadFixture(deployTrainTicketNMT);
    expect(await trainTicketNMT.symbol()).to.equal("WALLETMNT");
  });

  // it("Should have tokenUri 'filename.glb'", async function () {
  //   const { trainTicketNMT, owner } = await loadFixture(deployTrainTicketNMT);
  //   const Minted = {
  //     owner: owner.address,
  //     tokenId: "921600849408656576225127304129841157239410643646",
  //     uri: "filename.glb",
  //   };

  //   await trainTicketNMT.mint(owner.address);
  //   expect(
  //     await trainTicketNMT.ownerOf(
  //       "921600849408656576225127304129841157239410643646"
  //     )
  //   ).to.be.equal(Minted.owner);
  //   expect(
  //     await trainTicketNMT.tokenURI(
  //       "921600849408656576225127304129841157239410643646"
  //     )
  //   ).to.equal(Minted.uri);
  // });

  it("Should mint a new asset with the right address", async function () {
    const { trainTicketNMT, owner, creatorSmartPolicy, denyAllSmartPolicy } =
      await loadFixture(deployTrainTicketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID2_STRING,
      assetAddres: ASSET_ADDRESS2,
    };

    await trainTicketNMT.mint(
      owner.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );

    expect(await trainTicketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
      Minted.assetAddres
    );
  });

  it("Should mint a new asset and retrieves the same owner with getOwner", async function () {
    const {
      trainTicketNMT,
      owner,
      creatorSmartPolicy,
      account1,
      denyAllSmartPolicy,
    } = await loadFixture(deployTrainTicketNMT);
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
    const mint = await trainTicketNMT.mint(
      account1.address,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );
    // const jacketAddress = await trainTicketNMT.getJacketAddress(Minted.tokenId);

    await expect(mint)
      .to.emit(trainTicketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted.from, Minted.owner, Minted.tokenId);

    // 2. It is retrieved the jacketAddress from th NMT contract
    expect(await trainTicketNMT.getMutableAssetAddress(Minted.tokenId)).to.be.equal(
      Minted.address
    );
    // 3. It is retrieved the ownerOf(tokeind of the new minted address) from th NMT contract
    expect(await trainTicketNMT.ownerOf(Minted.tokenId)).to.equal(Minted.owner);
    // 4. A JacektMutableAsset instance is created from its minted address
    const jacketMutableAsset = JacketMutableAsset.attach(Minted.address);
    // 5. it's verified that the Asset has the same address that it is stored on the NTM
    expect(await jacketMutableAsset.nmt()).to.be.equal(trainTicketNMT.address);
    // 6. it's verified that the Asset has the same owner that it is stored on the NTM
    expect(await jacketMutableAsset.callStatic.getHolder()).to.be.equal(
      Minted.owner
    );
  });

  //
  //   it("Should be owned by the owner associated with the TokenId", async function () {
  //     const { trainTicketNMT, owner } = await loadFixture(deployTrainTicketNMT);
  //     const Minted = {
  //       owner: owner.address,
  //       tokenId: "921600849408656576225127304129841157239410643646",
  //       uri: "filename.glb",
  //     };

  //     await trainTicketNMT.mint(owner.address);
  //     expect(
  //       await trainTicketNMT.ownerOf(
  //         "921600849408656576225127304129841157239410643646"
  //       )
  //     ).to.be.equal(Minted.owner);
  //   });

  it("Should be minted and transfer twice the NFT ownership and check the rigth owner through the ownerOf(tokenId) method", async function () {
    const {
      trainTicketNMT,
      owner,
      account1,
      account2,
      creatorSmartPolicy,
      denyAllSmartPolicy,
    } = await loadFixture(deployTrainTicketNMT);
    const Minted = {
      from: ZERO_ADDRESS,
      firstOwner: owner.address,
      secondOwner: account1.address,
      thirdOwner: account2.address,
      tokenId: TOKEN_ID1_STRING,
    };

    // Minting the NFT to the First Owner
    const mintResponse = await trainTicketNMT.mint(
      Minted.firstOwner,
      creatorSmartPolicy.address,
      denyAllSmartPolicy.address
    );
    await expect(mintResponse)
      .to.emit(trainTicketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted.from, Minted.firstOwner, Minted.tokenId);

    expect(await trainTicketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.firstOwner
    );

    // Trasfering the NFT to the Second Owner
    await trainTicketNMT.transferFrom(
      Minted.firstOwner,
      Minted.secondOwner,
      Minted.tokenId
    );

    // Check that the new owner is changed
    expect(await trainTicketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.secondOwner
    );

    // Trasfering NFT to the Third Owner
    await trainTicketNMT
      .connect(account1)
      .transferFrom(Minted.secondOwner, Minted.thirdOwner, Minted.tokenId);

    // Check that the new owner is changed
    expect(await trainTicketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.thirdOwner
    );
  });

  //   it("Should be minted and tansfer to a different user (Account1) and visible in the Transfer event", async function () {
  //     const { trainTicketNMT, owner, account1 } = await loadFixture(deployTrainTicketNMT);
  //     const Minted = {
  //       owner: owner.address,
  //       tokenId: 921600849408656576225127304129841157239410643646,
  //     };

  //     // minting NFT
  //     const mintResponse = await trainTicketNMT.mint(owner.address);
  //     const mintReceipt = await mintResponse.wait();
  //     // Trasfering NFT to Account1
  //     const transferFromResponse = await trainTicketNMT.transferFrom(
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
  //       deployTrainTicketNMT
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
  describe("Test with NFT", () => {
  it("Minting and transferFrom", async function () {
    const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NonFungibleToken");
    const nft = await NFT.deploy(creator.address);

    await nft.mintCollectionNFT(creator.address, 1);
    await nft.transferFrom(creator.address, buyer.address, 1);
  });
});
});
