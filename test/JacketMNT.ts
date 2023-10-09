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

describe("JacketNMT", function () {
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

  describe("MNT", function () {
    it("Should revert if the miner is 0 address", async function () {
      // valid alternative to ZERO_ADDRESS is
      // ethers.constants.AddressZero
      const { jacketNMT } = await loadFixture(deployJacketNMT);
      expect(jacketNMT.mint(ZERO_ADDRESS)).to.be.revertedWith(
        "Ownable: new owner is the zero address"
      );
    });

    it("Should be able to be minted and owned", async function () {
      // valid alternative ethers.constants.AddressZero
      const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
      await jacketNMT.mint(owner.address);
      expect(await jacketNMT.owner()).to.equal(owner.address);
    });

    it("Should be able to be minted a new Asset and return the asset address and the asset tokenId", async function () {
      const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: 1048441399354366663447528331587451327875741636968,
        assetAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
      };

      const mintResponse = await jacketNMT.callStatic.mint(owner.address);
      const assetAddress = mintResponse[0];
      const tokenId = mintResponse[1];
      expect(Number(tokenId)).to.equal(Minted.tokenId);
      expect(assetAddress).to.equal(Minted.assetAddress);
    });

    it("Should be minted and trigger events with the right onwer and tokenId", async function () {
      const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
      const Minted = {
        owner: owner.address,
        tokenId: 1048441399354366663447528331587451327875741636968,
      };

      const txResponse = await jacketNMT.mint(owner.address);
      const txReceipt = await txResponse.wait();

      const events = txReceipt.events;
      const OwnershipTransferredEvent = events[0].args;

      const TransferEvent = events[1].args;
      const newOwner = OwnershipTransferredEvent?.newOwner;
      const tokenId: Number = TransferEvent?.tokenId;

      expect(newOwner).to.equal(Minted.owner);
      expect(Number(tokenId)).to.equal(Minted.tokenId);
    });

    // it("Should minted two assets with two differents tokenIds and the same owner ", async function () {
    //   const { jacketNMT, owner, account1, account2 } = await loadFixture(
    //     deployJacketNMT
    //   );
    //   const Minted1 = {
    //     from: "0x0000000000000000000000000000000000000000",
    //     owner: owner.address,
    //     tokenId: "1048441399354366663447528331587451327875741636968",
    //   };

    //   const Minted2 = {
    //     from: "0x0000000000000000000000000000000000000000",
    //     owner: owner.address,
    //     tokenId: "1048441399354366663447528331587451327875741636968",
    //   };

    //   await expect(jacketNMT.mint(account1.address))
    //     .to.emit(jacketNMT, "Transfer")
    //     // from, to, tokenId
    //     .withArgs(Minted1.from, account1.address, Minted1.tokenId);
    //   await expect()
    //     .to.emit(jacketNMT, "Transfer")
    //     // from, to, tokenId
    //     .withArgs(Minted2.from, account2.address, Minted2.tokenId);
    // });

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

    //
    // it("Should have address....", async function () {
    // const { jacketNMT, owner } = await loadFixture(deployJacketNMT);
    // const Minted = {
    // owner: owner.address,
    // tokenId: "921600849408656576225127304129841157239410643646",
    // uri: "filename.glb",
    // };
    //
    // await jacketNMT.mint(owner.address)
    //
    //console.log(await jacketNMT.getJacketAddress(
    //"921600849408656576225127304129841157239410643646"))
    // expect(
    // await jacketNMT.getJacketAddress(
    // "921600849408656576225127304129841157239410643646"
    // )
    // ).to.be.equal("0xa16e02e87b7454126e5e10d957a927a7f5b5d2be");
    // });
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

    //   it("Should be minted and transfer twice the NFT ownership and checked the rigth owner through the ownerOf(tokenId) method", async function () {
    //     const { jacketNMT, owner, account1, account2 } = await loadFixture(
    //       deployJacketNMT
    //     );
    //     const Minted = {
    //       firstOwner: owner.address,
    //       secondOwner: account1.address,
    //       thirdOwner: account2.address,
    //       tokenId: "921600849408656576225127304129841157239410643646",
    //       uri: "filename.glb",
    //     };

    //     // Minting the NFT to the First Owner
    //     const mintResponse = await jacketNMT.mint(Minted.firstOwner);
    //     await mintResponse.wait();
    //     expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
    //       Minted.firstOwner
    //     );

    //     // Trasfering the NFT to the Second Owner
    //     await jacketNMT.transferFrom(
    //       Minted.firstOwner,
    //       Minted.secondOwner,
    //       "921600849408656576225127304129841157239410643646"
    //     );

    //     // Check that the new owner is changed
    //     expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
    //       Minted.secondOwner
    //     );

    //     // Trasfering NFT to the Third Owner
    //     await jacketNMT
    //       .connect(account1)
    //       .transferFrom(
    //         Minted.secondOwner,
    //         Minted.thirdOwner,
    //         "921600849408656576225127304129841157239410643646"
    //       );

    //     // Check that the new owner is changed
    //     expect(await jacketNMT.ownerOf(Minted.tokenId)).to.be.equal(
    //       Minted.thirdOwner
    //     );
    //   });

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
