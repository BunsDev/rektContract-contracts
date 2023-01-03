const { ethers } = require("hardhat");
require("dotenv").config();
const { getMerkleRoot, getProofForAddress } = require("./../scripts/getMerkleRoot");

describe("lyncrent", () => {
    let owner;
    let org;
    let admin;
    let addr1;
    let addr2;
    let addr3;
    let creator;
    let rektNFTFactory;
    let rektNFT;

    beforeEach(async () => {
        [owner, org, admin, addr1, addr2, addr3, creator] =
            await ethers.getSigners();

        let _merkleRoot = getMerkleRoot()
        rektNFTFactory = await ethers.getContractFactory("rektNFT");
        rektNFT = await rektNFTFactory.connect(owner).deploy("Rekt-NFT", "REKT", _merkleRoot);

        await rektNFT.deployed();
        console.log("rektNFT address", rektNFT.address)


    });

    describe("Testing for rektNFT nft contract", () => {
        it("Create and check if the minting works with Signatires", async () => {
            // await rektNFT.connect(owner).


            // await rektNFT.connect(owner).setpublicSale(true)
            // await rektNFT.connect(addr2).getNFT([])
            // console.log("nft minted")
            await rektNFT.connect(owner).setWhitelistSale(true)

            console.log(getProofForAddress(addr2.address))
            let merkleProofs = getProofForAddress(addr3.address)
            await rektNFT.connect(addr3).getNFT(merkleProofs)
            console.log("nft minted")



        });
    });




});