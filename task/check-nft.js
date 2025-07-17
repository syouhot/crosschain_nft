const {  task } = require("hardhat/config");

task("check-nft").setAction(async function (taskArgs, hre) {
    const { firstAccount } = await getNamedAccounts();
    const nft = await hre.ethers.getContract("MyToken", firstAccount);
    const totalSupply = nft.totalSupply();
    for (let tokenId = 0; tokenId < totalSupply; tokenId++){
        const owner = await nft.ownerOf(tokenId)
        console.log(`tokebId: ${tokenId}--- owner: ${owner}`);
        
    }
})

module.exports = {}