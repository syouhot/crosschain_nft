import { developmentChains,networkConfig } from "../helper-hardhat-config";
const { ethers, network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;
    let sourceChainRouter, linkTokenAddr
    if (developmentChains.includes(network.name)) { 
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        const ccipSimulator =await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()//源码中的方法,可参考github文档
        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }
    const nftDeployment = await deployments.get("MyToken")
    const nftAddress = nftDeployment.address;
    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args:[sourceChainRouter,linkTokenAddr,nftAddress]
    })
    log("NFTPoolLockAndRelease deployed successfully")

}

module.exports.tags = ["sourcechain","all"]