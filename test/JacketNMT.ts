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

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const TOKEN_ID1 = 1048441399354366663447528331587451327875741636968;
const TOKEN_ID1_STRING = "1048441399354366663447528331587451327875741636968";
const TOKEN_ID2_STRING = "95779725308633401620950732676832305712008989990";

const ASSET_ADDRESS1 = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968";
const ASSET_ADDRESS2 = "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26";

describe("JacketNMT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployJacketNMT() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [owner, account1, account2] = await ethers.getSigners();
    // console.log(owner.address)
    // console.log(account1.address)
    // console.log(account2.address)
    const JacketNMT = await ethers.getContractFactory("JacketNMT");
    const jacketNMT = await JacketNMT.deploy();

    const CreatorSmartPolicy = await ethers.getContractFactory("CreatorSmartPolicy");
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

    return { jacketNMT, owner, account1, account2, creatorSmartPolicy };
  }

  it("Should revert if the miner is 0 address", async function () {
    // valid alternative to ZERO_ADDRESS is
    // ethers.constants.AddressZero
    const { jacketNMT } = await loadFixture(deployJacketNMT);
    expect(jacketNMT.mint(ZERO_ADDRESS)).to.be.revertedWith(
      "Ownable: new owner is the zero address"
    );
  });

  it("Should mint and own", async function () {
    // valid alternative ethers.constants.AddressZero
    const { jacketNMT, owner, creatorSmartPolicy } = await loadFixture(deployJacketNMT);
    await jacketNMT.mint(owner.address, creatorSmartPolicy.address);
    expect(await jacketNMT.owner()).to.equal(owner.address);
  });

  it("Should mint a new asset and return its address and tokenId", async function () {
    const { jacketNMT, owner, creatorSmartPolicy } = await loadFixture(deployJacketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID1,
      assetAddress: ASSET_ADDRESS1,
    };

    const mintResponse = await jacketNMT.callStatic.mint(owner.address, creatorSmartPolicy.address);
    const assetAddress = mintResponse[0];
    const tokenId = mintResponse[1];

    expect(Number(tokenId)).to.equal(Minted.tokenId);
    expect(assetAddress).to.equal(Minted.assetAddress);
  });


  it("Should mint new asset and trigger the Transfer event with the right onwer and tokenId", async function () {
    const { jacketNMT, owner, creatorSmartPolicy } = await loadFixture(deployJacketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID1,
    };

    const txResponse = await jacketNMT.mint(owner.address, creatorSmartPolicy.address);
    const txReceipt = await txResponse.wait();
    console.log("aaa")

    const events = txReceipt.events;

    const TransferEvent = events[0].args;
    const tokenId: Number = TransferEvent?.tokenId;

    expect(Number(tokenId)).to.equal(Minted.tokenId);
  });

  it("Should mint two assets with two differents tokenIds and the same owner within the Transfer event", async function () {
    const { jacketNMT, owner, account1, account2, creatorSmartPolicy } = await loadFixture(
      deployJacketNMT
    );
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
    const mint1 = await jacketNMT.mint(account1.address, creatorSmartPolicy.address);
    const mint2 = await jacketNMT.mint(account1.address, creatorSmartPolicy.address);

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

  it("Should mint a new asset with the right address", async function () {
    const { jacketNMT, owner, creatorSmartPolicy } = await loadFixture(deployJacketNMT);
    const Minted = {
      owner: owner.address,
      tokenId: TOKEN_ID2_STRING,
      assetAddres: ASSET_ADDRESS2,
    };

    await jacketNMT.mint(owner.address, creatorSmartPolicy.address);

    expect(await jacketNMT.getJacketAddress(Minted.tokenId)).to.be.equal(
      Minted.assetAddres
    );
  });

  it("Should mint a new asset and retrieves the same owner with getOwner", async function () {
    const { jacketNMT, owner, creatorSmartPolicy, account1 } = await loadFixture(deployJacketNMT);
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
    const mint = await jacketNMT.mint(account1.address, creatorSmartPolicy.address);
    // const jacketAddress = await jacketNMT.getJacketAddress(Minted.tokenId);

    await expect(mint)
      .to.emit(jacketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted.from, Minted.owner, Minted.tokenId);

    // 2. It is retrieved the jacketAddress from th NMT contract
    expect(await jacketNMT.getJacketAddress(Minted.tokenId)).to.be.equal(
      Minted.address
    );
    // 3. It is retrieved the ownerOf(tokeind of the new minted address) from th NMT contract
    expect(await jacketNMT.ownerOf(Minted.tokenId)).to.equal(Minted.owner);
    // 4. A JacektMutableAsset instance is created from its minted address
    const jacketMutableAsset = JacketMutableAsset.attach(Minted.address);
    // 5. it's verified that the Asset has the same address that it is stored on the NTM
    expect(await jacketMutableAsset.getNMT()).to.be.equal(jacketNMT.address);
    // 6. it's verified that the Asset has the same owner that it is stored on the NTM
    expect(await jacketMutableAsset.callStatic.getHolder()).to.be.equal(
      Minted.owner
    );
  });

  //
  //   it("Should be owned by the owner associated with the TokenId", async function () {
  //     const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
  //     const Minted = {
  //       owner: owner.address,
  //       tokenId: "921600849408656576225127304129841157239410643646",
  //       uri: "filename.glb",
  //     };

  //     await jacketNMT.mint(owner.address);
  //     expect(
  //       await jacketNMT.ownerOf(
  //         "921600849408656576225127304129841157239410643646"
  //       )
  //     ).to.be.equal(Minted.owner);
  //   });

  it("Should be minted and transfer twice the NFT ownership and checked the rigth owner through the ownerOf(tokenId) method", async function () {
    const { jacketNMT, owner, account1, account2, creatorSmartPolicy } = await loadFixture(
      deployJacketNMT
    );
    const Minted = {
      from: ZERO_ADDRESS,
      firstOwner: owner.address,
      secondOwner: account1.address,
      thirdOwner: account2.address,
      tokenId: TOKEN_ID1_STRING,
    };

    // Minting the NFT to the First Owner
    const mintResponse = await jacketNMT.mint(Minted.firstOwner, creatorSmartPolicy.address);
    await expect(mintResponse)
      .to.emit(jacketNMT, "Transfer")
      // from, to, tokenId
      .withArgs(Minted.from, Minted.firstOwner, Minted.tokenId);

    expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.firstOwner
    );

    // Trasfering the NFT to the Second Owner
    await jacketNMT.transferFrom(
      Minted.firstOwner,
      Minted.secondOwner,
      Minted.tokenId
    );

    // Check that the new owner is changed
    expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.secondOwner
    );

    // Trasfering NFT to the Third Owner
    await jacketNMT
      .connect(account1)
      .transferFrom(Minted.secondOwner, Minted.thirdOwner, Minted.tokenId);

    // Check that the new owner is changed
    expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.thirdOwner
    );
  });

  //   it("Should be minted and tansfer to a different user (Account1) and visible in the Transfer event", async function () {
  //     const { jacketNMT, owner, account1 } = await loadFixture(deployJacketNMT);
  //     const Minted = {
  //       owner: owner.address,
  //       tokenId: 921600849408656576225127304129841157239410643646,
  //     };

  //     // minting NFT
  //     const mintResponse = await jacketNMT.mint(owner.address);
  //     const mintReceipt = await mintResponse.wait();
  //     // Trasfering NFT to Account1
  //     const transferFromResponse = await jacketNMT.transferFrom(
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
  //       deployJacketNMT
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
