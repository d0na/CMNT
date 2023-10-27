import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployJacketAsset } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketMutableAssetFail", function () {
  describe("The owner (buyer)", function () {
    it("should fail changing the color Jacket to 1 due to the DENY aLL Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(
        deployJacketAsset
      );
      expect(
        await jacketMutableAsset.connect(buyer).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });

    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(
        deployJacketAsset
      );
      await expect(
        jacketMutableAsset.connect(buyer).setColor(2, "red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });

    it("Should change the color Jacket to 5 and fail due to HOLDER Policy", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(
        deployJacketAsset
      );
      await expect(
        jacketMutableAsset.connect(buyer).setColor(5, "yellow")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });

  describe("The tailor (tailor1)", function () {
    it("Should change the color Jacket to 2 and fail due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor1 } = await loadFixture(
        deployJacketAsset
      );
      await expect(
        jacketMutableAsset.connect(tailor1).setColor(2, "red")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });

  describe("The tailor (tailor2) not in the allowed creator list", function () {
    it("Should not change the color Jacket to 1 failing due to CREATOR Policy", async function () {
      const { jacketMutableAsset, tailor2 } = await loadFixture(
        deployJacketAsset
      );
      await expect(
        jacketMutableAsset.connect(tailor2).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by CREATOR policy");
    });
  });
  describe("The creator (creator) not allowed by the HOLDER policy", function () {
    it("Should not change the color Jacket to 1 failing due to HOLDER Policy", async function () {
      const { jacketMutableAsset, creator } = await loadFixture(
        deployJacketAsset
      );
      await expect(
        jacketMutableAsset.connect(creator).setColor(1, "green")
      ).to.be.rejectedWith("Operation DENIED by HOLDER policy");
    });
  });
});
