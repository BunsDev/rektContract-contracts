
const hre = require("hardhat");
const { getMerkleRoot } = require("./getMerkleRoot");
const { ethers } = require("hardhat")
async function main() {
    const verify = async (_adrs, _args) => {
        await hre.run("verify:verify", {
            address: _adrs,
            constructorArguments: [_args],
        });
    }
    let _merkleRoot = getMerkleRoot()
    console.log("MERKLE root", _merkleRoot)
    const Contract = await ethers.getContractFactory('rektNFT')
    const contract = await Contract.deploy("Rekt-NFT", "REKT", _merkleRoot)
    await contract.deployed()
    console.log('NFT Contract deployed to:', contract.address)
    await contract.deployed();
    // await hre.run("verify:verify", {
    //     address: contract.address,
    //     constructorArguments: ["Rekt-NFT", "REKT", _merkleRoot],
    // });
}
main()