const {  task } = require("hardhat/config");

task("check-nft").setAction(async function (taskArgs, hre) {
    const { firstAccount } = await getNamedAccounts();
    const wnft = await hre.ethers.getContract("WrappedMyToken", firstAccount);
    const totalSupply = wnft.totalSupply();
    for (let tokenId = 0; tokenId < totalSupply; tokenId++){
        const owner = await wnft.ownerOf(tokenId)
        console.log(`tokebId: ${tokenId}--- owner: ${owner}`);
        
    }
})

module.exports = {}