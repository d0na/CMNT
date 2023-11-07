import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {  deployJacketAssetWithManyAttributes, deployJacketAssetWithManyParams } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketMutableAsset Smart Polices", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("Many Attributes and setters", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketAssetWithManyAttributes();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });


  it("Many params", async function () {
    const { jacketNMT, jacketMutableAsset } = await deployJacketAssetWithManyParams();
    const nmt = await jacketMutableAsset.nmt();
    expect(nmt).to.be.equal(jacketNMT.address);
  });
  
});
