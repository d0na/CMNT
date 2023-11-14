import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployMutableAssetWithManyParams,
  deployMutableAssetWithManySetters,
} from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setu-p once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.

// it("Many Attributes and setters", async function () {
//   const { jacketNMT, jacketMutableAsset } = await deployJacketAssetWithManyAttributes();
//   const nmt = await jacketMutableAsset.nmt();
//   expect(nmt).to.be.equal(jacketNMT.address);
// });

// it("Many params", async function () {
//   const { jacketNMT, jacketMutableAsset } = await deployMutableAssetWithManyParams();
//   const nmt = await jacketMutableAsset.nmt();
//   expect(nmt).to.be.equal(jacketNMT.address);
// });

describe("MutableAssets test with many params ", function () {
  it("setMethod 10 params", async function () {
    const { jacketNMT, mutableAsset10a, tailor1 } =
      await deployMutableAssetWithManyParams();
    // const tx = await mutableAsset10a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7,8,9,10);
    // const mintResponse = await tx.wait();
    // console.log(mintResponse.events[0])
    // console.log(await mutableAsset10a.getJacketDescriptor());
    await expect(
      mutableAsset10a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    )
      .to.emit(mutableAsset10a, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
        Number(9),
        Number(10),
      ]);
  });

  it("setMethod 9 params", async function () {
    const { jacketNMT, mutableAsset9a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(
      mutableAsset9a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8, 9)
    )
      .to.emit(mutableAsset9a, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
        Number(9),
      ]);
  });

  it("setMethod 8 params", async function () {
    const { jacketNMT, mutableAsset8a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(
      mutableAsset8a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7, 8)
    )
      .to.emit(mutableAsset8a, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
      ]);
  });
  it("setMethod 7 params", async function () {
    const { jacketNMT, mutableAsset7a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset7a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7))
      .to.emit(mutableAsset7a, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
      ]);
  });

  it("setMethod 6 params", async function () {
    const { jacketNMT, mutableAsset6a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset6a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6))
      .to.emit(mutableAsset6a, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });
  it("setMethod 5 params", async function () {
    const { jacketNMT, mutableAsset5a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset5a.connect(tailor1).setMethod(1, 2, 3, 4, 5))
      .to.emit(mutableAsset5a, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });

  it("setMethod 4 params", async function () {
    const { jacketNMT, mutableAsset4a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset4a.connect(tailor1).setMethod(1, 2, 3, 4))
      .to.emit(mutableAsset4a, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });

  it("setMethod 3 params", async function () {
    const { jacketNMT, mutableAsset3a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset3a.connect(tailor1).setMethod(1, 2, 3))
      .to.emit(mutableAsset3a, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });

  it("setMethod 2 params", async function () {
    const { jacketNMT, mutableAsset2a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset2a.connect(tailor1).setMethod(1, 2))
      .to.emit(mutableAsset2a, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });

  it("setMethod 1 params", async function () {
    const { jacketNMT, mutableAsset1a, tailor1 } =
      await deployMutableAssetWithManyParams();
    await expect(mutableAsset1a.connect(tailor1).setMethod(1))
      .to.emit(mutableAsset1a, "StateChanged")
      .withArgs([Number(1)]);
  });
  // it("xxxxx", async function () {
  //   const ERC721 = await ethers.getContractFactory("ERC721");
  //   const erc721 = await ERC721.deploy();

  //   console.log(erc721.mint());

  // });
});
describe("MutableAssets test with many setters ", function () {
  it("setMethod 10 ", async function () {
    const { jacketNMT, mutableAsset10, tailor1 } =
      await deployMutableAssetWithManySetters();
    // const tx = await mutableAsset10a.connect(tailor1).setMethod(1, 2, 3, 4, 5, 6, 7,8,9,10);
    // const mintResponse = await tx.wait();
    // console.log(mintResponse.events[0])
    // console.log(await mutableAsset10a.getJacketDescriptor());
    mutableAsset10.connect(tailor1).setMethod1(1);
    mutableAsset10.connect(tailor1).setMethod2(2);
    mutableAsset10.connect(tailor1).setMethod3(3);
    mutableAsset10.connect(tailor1).setMethod4(4);
    mutableAsset10.connect(tailor1).setMethod5(5);
    mutableAsset10.connect(tailor1).setMethod6(6);
    mutableAsset10.connect(tailor1).setMethod7(7);
    mutableAsset10.connect(tailor1).setMethod8(8);
    mutableAsset10.connect(tailor1).setMethod9(9);
    await expect(mutableAsset10.connect(tailor1).setMethod10(10))
      .to.emit(mutableAsset10, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
        Number(9),
        Number(10),
      ]);
  });

  it("setMethod 9 ", async function () {
    const { jacketNMT, mutableAsset9, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset9.connect(tailor1).setMethod1(1);
    mutableAsset9.connect(tailor1).setMethod2(2);
    mutableAsset9.connect(tailor1).setMethod3(3);
    mutableAsset9.connect(tailor1).setMethod4(4);
    mutableAsset9.connect(tailor1).setMethod5(5);
    mutableAsset9.connect(tailor1).setMethod6(6);
    mutableAsset9.connect(tailor1).setMethod7(7);
    mutableAsset9.connect(tailor1).setMethod8(8);
    await expect(mutableAsset9.connect(tailor1).setMethod9(9))
      .to.emit(mutableAsset9, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
        Number(9),
      ]);
  });

  it("setMethod 8 ", async function () {
    const { jacketNMT, mutableAsset8, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset8.connect(tailor1).setMethod1(1);
    mutableAsset8.connect(tailor1).setMethod2(2);
    mutableAsset8.connect(tailor1).setMethod3(3);
    mutableAsset8.connect(tailor1).setMethod4(4);
    mutableAsset8.connect(tailor1).setMethod5(5);
    mutableAsset8.connect(tailor1).setMethod6(6);
    mutableAsset8.connect(tailor1).setMethod7(7);
    await expect(mutableAsset8.connect(tailor1).setMethod8(8))
      .to.emit(mutableAsset8, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
        Number(8),
      ]);
  });
  it("setMethod 7 ", async function () {
    const { jacketNMT, mutableAsset7, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset7.connect(tailor1).setMethod1(1);
    mutableAsset7.connect(tailor1).setMethod2(2);
    mutableAsset7.connect(tailor1).setMethod3(3);
    mutableAsset7.connect(tailor1).setMethod4(4);
    mutableAsset7.connect(tailor1).setMethod5(5);
    mutableAsset7.connect(tailor1).setMethod6(6);
    // console.log(await mutableAsset7.getJacketDescriptor());
    await expect(mutableAsset7.connect(tailor1).setMethod7(7))
      .to.emit(mutableAsset7, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
        Number(7),
      ]);
  });

  it("setMethod 6 ", async function () {
    const { jacketNMT, mutableAsset6, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset6.connect(tailor1).setMethod1(1);
    mutableAsset6.connect(tailor1).setMethod2(2);
    mutableAsset6.connect(tailor1).setMethod3(3);
    mutableAsset6.connect(tailor1).setMethod4(4);
    mutableAsset6.connect(tailor1).setMethod5(5);
    await expect(mutableAsset6.connect(tailor1).setMethod6(6))
      .to.emit(mutableAsset6, "StateChanged")
      .withArgs([
        Number(1),
        Number(2),
        Number(3),
        Number(4),
        Number(5),
        Number(6),
      ]);
  });
  it("setMethod 5 ", async function () {
    const { jacketNMT, mutableAsset5, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset5.connect(tailor1).setMethod1(1);
    mutableAsset5.connect(tailor1).setMethod2(2);
    mutableAsset5.connect(tailor1).setMethod3(3);
    mutableAsset5.connect(tailor1).setMethod4(4);
    await expect(mutableAsset5.connect(tailor1).setMethod5(5))
      .to.emit(mutableAsset5, "StateChanged")
      .withArgs([Number(1), Number(2), Number(3), Number(4), Number(5)]);
  });

  it("setMethod 4 ", async function () {
    const { jacketNMT, mutableAsset4, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset4.connect(tailor1).setMethod1(1);
    mutableAsset4.connect(tailor1).setMethod2(2);
    mutableAsset4.connect(tailor1).setMethod3(3);
    await expect(mutableAsset4.connect(tailor1).setMethod4(4))
      .to.emit(mutableAsset4, "StateChanged")
      .withArgs([Number(1), Number(2), Number(3), Number(4)]);
  });

  it("setMethod 3 ", async function () {
    const { mutableAsset3, tailor1 } =
      await deployMutableAssetWithManySetters();
    mutableAsset3.connect(tailor1).setMethod1(1);
    mutableAsset3.connect(tailor1).setMethod2(2);

    await expect(mutableAsset3.connect(tailor1).setMethod3(3))
      .to.emit(mutableAsset3, "StateChanged")
      .withArgs([Number(1), Number(2), Number(3)]);
  });

  it("setMethod 2 ", async function () {
    const { mutableAsset2, tailor1 } =
      await deployMutableAssetWithManySetters();
    // const tx = await mutableAsset2.connect(tailor1).setMethod2(2);
    // const mintResponse = await tx.wait();
    // console.log(mintResponse.events[0]);
    // console.log(await mutableAsset2.getJacketDescriptor());
    mutableAsset2.connect(tailor1).setMethod1(1);
    await expect(mutableAsset2.connect(tailor1).setMethod2(2))
      .to.emit(mutableAsset2, "StateChanged")
      .withArgs([Number(1), Number(2)]);
  });

  it("setMethod1", async function () {
    const { mutableAsset1, tailor1 } =
      await deployMutableAssetWithManySetters();
    //   const tx = await mutableAsset1.connect(tailor1).setMethod1(1);
    // const mintResponse = await tx.wait();
    // console.log(mintResponse.events[0])
    // console.log(await mutableAsset1.getJacketDescriptor());
    await expect(mutableAsset1.connect(tailor1).setMethod1(1))
      .to.emit(mutableAsset1, "StateChanged")
      .withArgs([Number(1)]);
  });

  describe("FFF", () => {
    it("xxxxx", async function () {
      const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
      const NFT = await ethers.getContractFactory("NonFungibleToken");
      const nft = await NFT.deploy(creator.address);

      console.log(await nft.mintCollectionNFT(creator.address, 1));
      console.log(await nft.transferFrom(creator.address, buyer.address, 1));
    });
  });
});
