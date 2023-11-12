import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployJacketAssetWithManyAttributes, deployMutableAssetWithManyParams } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("MutableAssets Smart Polices", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Many Attributes and setters", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketAssetWithManyAttributes();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });


  it("Many params", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployMutableAssetWithManyParams();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });



  it("setMethod 10 params", async function () {
    const { jacketNMT, mutableAsset10a, tailor1 } = await deployMutableAssetWithManyParams();
    // const tx = await mutableAsset10a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7,8,9,10, "");
    // const mintResponse = await tx.wait();
    // console.log(mintResponse.events[0])
    // console.log(await mutableAsset10a.getJacketDescriptor());
    await expect(mutableAsset10a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ""))
      .to.emit(mutableAsset10a, "StateChanged")
      .withArgs([Number(0), false, Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7), Number(8), Number(9), Number(10)]);
  });

  it("setMethod 9 params", async function () {
    const { jacketNMT, mutableAsset9a, tailor1 } = await deployMutableAssetWithManyParams();
    await expect(mutableAsset9a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8, 9, ""))
      .to.emit(mutableAsset9a, "StateChanged")
      .withArgs([Number(0), false, Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7), Number(8), Number(9)]);
  });

  it("setMethod 8 params", async function () {
    const { jacketNMT, mutableAsset8a, tailor1 } = await deployMutableAssetWithManyParams();
    await expect(mutableAsset8a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8, ""))
      .to.emit(mutableAsset8a, "StateChanged")
      .withArgs([Number(0), false, Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7), Number(8)]);
  });
  it("setMethod 7 params", async function () {
    const { jacketNMT, mutableAsset7a, tailor1 } = await deployMutableAssetWithManyParams();
    await expect(mutableAsset7a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, ""))
      .to.emit(mutableAsset7a, "StateChanged")
      .withArgs([Number(0), false, Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7)]);
  });
  it("setMethod 1 params", async function () {
    const { jacketNMT, mutableAsset1a, tailor1 } = await deployMutableAssetWithManyParams();
    await expect(mutableAsset1a.connect(tailor1).setMethod(1, ""))
      .to.emit(mutableAsset1a, "StateChanged")
      .withArgs([Number(0), false, Number(1)]);
  });
  it("setMethod 2 params", async function () {
    const { jacketNMT, mutableAsset2a, tailor1 } = await deployMutableAssetWithManyParams();
    await expect(mutableAsset2a.connect(tailor1).setMethod(1, 2, ""))
      .to.emit(mutableAsset2a, "StateChanged")
      .withArgs([Number(0), false, Number(1), Number(2)]);
  });

  it("xxxxx", async function () {
    const ERC721 = await ethers.getContractFactory("ERC721");
    const erc721 = await ERC721.deploy();

    console.log(erc721.mint());

  });

});
