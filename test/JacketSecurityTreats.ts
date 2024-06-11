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
import { deployJacketAsset } from "../helpers/test";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";


const TOKEN_ID1_STRING = "889536951267209200845529008624431100694138685621";
const TOKEN_ID2_STRING = "908326538895415626116914244041615655093740059278";

const ASSET_ADDRESS1 = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const ASSET_ADDRESS2 = "0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e";

describe("Security treats", () => {

  it("T1 - Should not allowed changing an internal variable of the mutable asset ", async function () {
    const { jacketMutableAsset } = await deployJacketAsset();
    const jacketDescriptor = await jacketMutableAsset.jacketDescriptor();
    expect(jacketDescriptor.length).to.be.equal(2);
    expect(jacketDescriptor["color"]).to.be.equal(0); //not color defined
    expect(jacketDescriptor["sleeves"]).to.be.equal(false); //not color defined

    // Try changing sleeves value
    jacketMutableAsset.jacketDescriptor["sleeves"] = true;
    expect(jacketDescriptor["sleeves"]).to.not.be.equal(true); //not color defined
  })

  // it("T3 - Should not allowed changing the smartPolicy to 3d party ", async function () {
  //   const { jacketMutableAsset } = await deployJacketAsset();
  //   await jacketMutableAsset.creatorSmartPolicy();

  // })


  it("T7 - Should test to cast the transferFrom method from NMT to NFT (ERC721) and provide the correct smart policy enforcement ", async function () {
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

    // Proving the owner and the tokenID
    expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
      Minted.firstOwner
    );

    // Instantiating the ERC721 smart contract
    const TestERC721 = await ethers.getContractFactory(
      "TestERC721"
    );
    const testERC721 = await TestERC721.deploy();

    // Trasfering the Mutable Asset to the Second Owner over the ERC721 smart contract (usign the rigth method transferFrom)
    await expect(testERC721.securedTransferFrom(jacketNMT.address, Minted.firstOwner,
      Minted.secondOwner,
      Minted.tokenId)).to.be.rejectedWith(
        "Operation DENIED by CREATOR policy"
      );

    // Trasfering the Mutable Asset to the Second Owner over the ERC721 smart contract (usign the casted method transferFrom)
    await expect(testERC721.castedTransferFrom(jacketNMT.address, Minted.firstOwner,
      Minted.secondOwner,
      Minted.tokenId)).to.be.rejectedWith(
        "Operation DENIED by CREATOR policy"
      );
  })
})