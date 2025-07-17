const { task } = require("hardhat/config");

task("mint-nft").setAction(async function (taskArgs, hre) {
    const { firstAccount } = await getNamedAccounts()
    const nft = await hre.ethers.getContract("MyToken", firstAccount)
    console.log("minting a nft form contract");
    
    const mintTx = await nft.safeMint(firstAccount)
    await mintTx.wait(6)
    console.log("minted a nft form contract");
})
   
module.exports = {}