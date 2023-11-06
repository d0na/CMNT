import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployJacketAsset, deployJacketAssetWithHolderPolicy } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketMutableAssetSuccess", function () {
  describe("The owner (buyer)", function () {
    it("should change the color Jacket to 1", async function () {
      const { jacketMutableAsset, buyer } = await loadFixture(
        deployJacketAssetWithHolderPolicy
      );
      const tx = jacketMutableAsset.connect(buyer).setColor(1, "green")
      await expect(tx)
        .to.emit(jacketMutableAsset, "StateChanged")
        .withArgs([1, false]);
    });

    describe("The tailor (tailor1)", function () {
      it("should change the color Jacket to 3 ", async function () {
        const { jacketMutableAsset, tailor1, buyer, holderSmartPolicy } =
          await loadFixture(deployJacketAssetWithHolderPolicy);
        await expect(jacketMutableAsset.connect(tailor1).setColor(3, "blu"))
          .to.emit(jacketMutableAsset, "StateChanged")
          .withArgs([3, false]);
      });
    });
  });
});
