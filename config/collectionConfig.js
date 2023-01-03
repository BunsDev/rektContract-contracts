
const whitelistAddresses = require('./whitelist.json');

const CollectionConfig = {
    // The contract name can be updated using the following command:
    // yarn rename-contract NEW_CONTRACT_NAME
    // Please DO NOT change it manually!
    contractName: 'rektNft',
    tokenName: 'Rekt-NFT',
    tokenSymbol: 'REKT',
    maxSupply: 2023,
    whitelistSale: {
        price: 0,
        maxMintAmountPerTx: 1,
    },
    publicSale: {
        price: 0,
        maxMintAmountPerTx: 1,
    },
    contractAddress: null,
    whitelistAddresses,
};

module.exports = CollectionConfig
