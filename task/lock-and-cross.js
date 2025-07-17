const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("lock-and-cross")
    .addOptionalParam("chainselector", "The chain selector of the target chain")//addOptionalParam可选参数
    .addOptionalParam("receiver", "The receiver of the NFT")
    .addParam("tokenid", "The token id of the NFT")//这里小写的原因是命令行不能写大写，如果是大写则录入时是token-id
    .setAction(async (taskArgs, hre) => {
        let chainSelector, receiver
        const tokenId = taskArgs.tokenid
        const { firstAcount } = await hre.ethers.getNamedAccounts()
        if (taskArgs.chainSelector) {
            chainSelector = taskArgs.chainSelector
        } else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
        }
        if (taskArgs.chainSelector) {
            receiver = taskArgs.receiver
        } else {
            const deployment =
               await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            receiver = deployment.address
        }
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await hre.ethers.getContractAt("LinkToken", linkTokenAddress)
        const nftPoolLockAndRelease = await hre.ethers.getContract("NFTPoolLockAndRelease",firstAcount)
        //充值
        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("0.1"))//这里金额可变，
        await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        //授权
        const nft = await hre.ethers.getContract("MyToken", firstAcount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        //锁池
        const lockAndSendNFTTx = await nftPoolLockAndRelease.lockAndSendNFT(tokenId, firstAcount, chainSelector, receiver)
        
    })

    module.exports = {};