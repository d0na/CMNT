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

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("JacketAsset", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setu-p once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployJacketNMT() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();
    const JacketNMT = await ethers.getContractFactory("JacketNMT");
    const jacketNMT = await JacketNMT.deploy();
    const OwnerSmartPolicy = await ethers.getContractFactory(
      "OwnerSmartPolicy"
    );
    const ownerSmartPolicy = await JacketNMT.deploy();
    const JacketAsset = await ethers.getContractFactory("JacketAsset");
    const jacketAsset = await JacketAsset.deploy(
      owner.address,
      ownerSmartPolicy.address
    );
    return { jacketNMT, owner, jacketAsset, account1, account2 };
  }

  

  describe("ABAC", function () {
    async function deployABACEnviroment() {
      // Contracts are deployed using the first signer/account by default
      const [owner] = await ethers.getSigners();
      // Pub Attribute Manager contract
      const PubAMContract = await ethers.getContractFactory("PubAM");
      const pubAm = await PubAMContract.deploy();
      // Pip Policy information point contract
      const Pip = await ethers.getContractFactory("PolicyInformationPoint");
      const pip = await Pip.deploy(pubAm.address);
      // Csp Policy decision point contract
      const Csp = await ethers.getContractFactory("CreatorSmartPolicy");
      const csp = await Csp.deploy();
      const Utils = await ethers.getContractFactory("NMTUtils");
      const utils = await Utils.deploy();

      return { pip, owner, pubAm, csp, utils };
    }

    describe("NMTUtils", function () {
      it("Should shows endoded values", async function () {
        const { utils } = await loadFixture(deployABACEnviroment);
        console.log("encodesTestUint(200)", await utils.encodesTestUint());
        console.log("encodesTestBool(false)", await utils.encodesTestBool());
        console.log("encodesTestHex(FF00000)", await utils.encodesTestHex());
        console.log("encTest", await utils.encTest());
        const a = await utils.decodeData(await utils.encTest());
        console.log("decodeData(firs4Bytes-signature)", a[0]);
        console.log("decodeData(params)", a[1]);
        console.log("printTest", await utils.printTest());
        console.log("comparingSig", await utils.comparingSig());

        //bytes4(keccak256("transfer(address,uint256)")

        console.log(
          "decode uint",
          await utils.bytesToUint(
            0x00000000000000000000000000000000000000000000000000000000000000c8
          )
        );
        console.log("decode bool", await utils.bytesToBool(0x00));

        await expect(
          utils.bytesToUint(
            0x00000000000000000000000000000000000000000000000000000000000000c8
          )
        ).to.be;
      });

      it("Should decode bytes and return 200", async function () {
        const { utils } = await loadFixture(deployABACEnviroment);
        expect(
          await utils.bytesToUint(
            0x00000000000000000000000000000000000000000000000000000000000000c8
          )
        ).to.be.equals(Number(200));
      });

      it("Should decode bool and return false", async function () {
        const { utils } = await loadFixture(deployABACEnviroment);
        expect(await utils.bytesToBool(0x00)).to.be.equals(false);
      });

      it("Should decode hex and return false", async function () {
        const { utils } = await loadFixture(deployABACEnviroment);
        expect(await utils.bytesToBool(0x00)).to.be.equals(false);
      });
    });

    describe("PubAM", function () {
      it("Should return a list of allowed colors [1,3] by the brand Pub", async function () {
        const { pubAm } = await loadFixture(deployABACEnviroment);
        const pubAmTransaction = await pubAm.callStatic.allowedColorList();

        await expect(pubAmTransaction[0]).to.be.equals(1);
        await expect(pubAmTransaction[1]).to.be.equals(3);
      });

      it("Should return a list of allowed colors [1,3] by the PIP", async function () {
        const { pubAm, pip } = await loadFixture(deployABACEnviroment);
        const pipTransaction = await pubAm.callStatic.allowedColorList();

        await expect(pipTransaction[0]).to.be.equals(1);
        await expect(pipTransaction[1]).to.be.equals(3);
      });


      // it("Should return a list of authorized tailors by the brand Pub", async function () {
      //   const { pubAm } = await loadFixture(deployABACEnviroment);
      //   const pubAmTransaction = await pubAm.callStatic.authorizedTailorList();

      //   await expect(pubAmTransaction[0]).to.be.equals(0x21387C745c98f092C376151197E68e56E33);
      //   await expect(pubAmTransaction[1]).to.be.equals("pino");
      // });
    });

    describe("PIP", function () {
      it("Should create a valid PIP", async function () {
        const { pip } = await loadFixture(deployABACEnviroment);
        // console.log("pip address", pip.address);
        await expect(pip.address).to.be.eq(
          "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
        );
      });

      it("Should returns Pip's Pub list of allowed colour list", async function () {
        const { pip, owner } = await loadFixture(deployABACEnviroment);

        const pubAmTransaction = await pip.callStatic.pubAllowedColorList();

        await expect(pubAmTransaction[0]).to.be.equals(1);
        await expect(pubAmTransaction[1]).to.be.equals(3);
      });
    });

    describe("PDP", function () {
      // jacketNMT.address : 0x5FbDB2315678afecb367f032d93F642f64180aa3
      // pip.address 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
      // JacketAsset address: 0xa16e02e87b7454126e5e10d957a927a7f5b5d2be

      it("Should change the color Jacket to 1 with listed Tailor (account1) and succeed ", async function () {
        const { jacketAsset, account1 } = await loadFixture(deployJacketNMT);
        await loadFixture(deployABACEnviroment);
        // const tx = await jacketAsset.setColor(1);
        // let receipt = await tx.wait();
        // const events = receipt.events?.filter((x:any) => {return x.event == "StateChanged"})
        // console.log("receipt",events);
        // console.log(tx);
        // let tailorAccount = await impersonateAccount('0x21387C745c98f092C376151197E68e56E33de81e');
        // console.log("tailor",tailorAccount);
        await expect(jacketAsset.connect(account1).setColor(1))
          .to.emit(jacketAsset, "StateChanged")
          .withArgs([1, false]);
      });

      it("Should change the color Jacket to 2 with listed Tailor (account1) and fail due to Creator Policy", async function () {
        const { jacketAsset, account1 } = await loadFixture(deployJacketNMT);
        await loadFixture(deployABACEnviroment);
        await expect(jacketAsset.connect(account1).setColor(2)).to.be.rejectedWith(
          "Operation DENIED by CREATOR policy"
        );
      });

      it("Should change the color Jacket to 1 with listed Tailor but not that one indicated by the owner and fail due to Owner Policy", async function () {
        const { jacketAsset, account1 } = await loadFixture(deployJacketNMT);
        await loadFixture(deployABACEnviroment);

        const txResponse = await jacketAsset.setColor(1);
        const txReceipt = await txResponse.wait();
        console.log(txResponse);
        console.log(txReceipt);
      });

      // it("Should change the color Jacket to 'green' and emit StateChanged ", async function () {
      //   const { jacketAsset } = await loadFixture(deployJacketNMT);
      //   await loadFixture(deployABACEnviroment);
      //   // const tx = await jacketAsset.changeColor("red", "mario");
      //   // let receipt = await tx.wait();
      //   // const events = receipt.events?.filter((x) => {return x.event == "ChangedColor"})

      //   // console.log("receipt",events);
      //   // console.log(tx);
      //   await expect(jacketAsset.setColor("green", "mario"))
      //     .to.emit(jacketAsset, "StateChanged")
      //     .withArgs("green");
      // });

      // it("Should change the color Jacket to 'green' and change model3d ", async function () {
      //   const { jacketAsset } = await loadFixture(deployJacketNMT);
      //   await loadFixture(deployABACEnviroment);
      //   // const tx = await jacketAsset.changeColor("red", "mario");
      //   // let receipt = await tx.wait();
      //   // const events = receipt.events?.filter((x) => {return x.event == "ChangedColor"})

      //   // console.log("receipt",events);
      //   // console.log(tx);
      //   await expect(jacketAsset.setColor("green", "mario"))
      //     .to.emit(jacketAsset, "StateChanged")
      //     .withArgs("green");
      //   expect(await jacketAsset.model3d()).to.equal("greenJacket");
      // });

      // it("Should change the color Jacket to 'red' by the tailor 'mario' ", async function () {
      //   const { jacketAsset } = await loadFixture(deployJacketNMT);
      //   await loadFixture(deployABACEnviroment);
      //   await expect(jacketAsset.setColor("red", "mario"))
      //     .to.emit(jacketAsset, "ChangedColor")
      //     .withArgs("red");
      // });

      // it("Should be reverted when is trying to change the color Jacket to 'yellow' by the tailor 'mario' ", async function () {
      //   const { jacketAsset } = await loadFixture(deployJacketNMT);
      //   await loadFixture(deployABACEnviroment);
      //   await expect(jacketAsset.setColor("yellow", "mario")).to.be
      //     .revertedWithoutReason;
      // });

      // it("Should revert the transaction when it is trying to change the color of the Jacket to 'red'  by the tailor 'franco' that it is not allowed ", async function () {
      //   const { jacketAsset } = await loadFixture(deployJacketNMT);
      //   await loadFixture(deployABACEnviroment);
      //   await expect(jacketAsset.changeColor("red", "franco")).to.be
      //     .revertedWithoutReason;
      // });
    });
  });
});
