const { utils } = require('ethers')
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const CollectionConfig = require('./../config/collectionConfig');

const getMerkleRoot = () => {

    if (CollectionConfig["whitelistAddresses"].length < 1) {
        throw '\x1b[31merror\x1b[0m ' + 'The whitelist is empty, please add some addresses to the configuration.';
    }

    // Build the Merkle Tree
    const leafNodes = CollectionConfig.whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = '0x' + merkleTree.getRoot().toString('hex');
    console.log("root hash: ", rootHash);

    return rootHash;
}

const getMerkleTree = () => {

    if (CollectionConfig["whitelistAddresses"].length < 1) {
        throw '\x1b[31merror\x1b[0m ' + 'The whitelist is empty, please add some addresses to the configuration.';
    }

    // Build the Merkle Tree
    const leafNodes = CollectionConfig.whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

    return merkleTree;
}

const getProofForAddress = (address) => {
    return getMerkleTree().getHexProof(keccak256(address));
}

module.exports = { getMerkleRoot, getProofForAddress };

