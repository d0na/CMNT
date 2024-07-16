import { expect } from "chai";
import { create } from "domain";
import { ethers } from "hardhat";
import* as _ from "../typechain-types"

describe("MyNFT", function () {


  it("Minting and transferFrom", async function () {
    const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("MyNFT");
    const nft : _.MyNFT = await NFT.deploy(creator.address);

    await nft.mintCollectionNFT(creator.address, 1);
    expect(await nft.ownerOf(1)).to.equal(await creator.address);
    await nft.approve(creator.address, 1);
    await nft["safeTransferFrom(address,address,uint256)"](creator.address, buyer.address, 1);

  });

  it("Should mint and transfer an NFT to someone", async function () {
    const [creator, buyer, tailor1, tailor2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy(creator.address);
    console.log(creator.address);
    console.log(buyer.address);
    await nft.mintCollectionNFT(creator.address, 1);
    expect(await nft.ownerOf(1)).to.equal(await creator.address);
    await nft.approve(creator.address, 1);
    await nft.transferFrom(creator.address, buyer.address, 1);
    expect(await nft.ownerOf(1)).to.equal(await buyer.address);
  });
});
