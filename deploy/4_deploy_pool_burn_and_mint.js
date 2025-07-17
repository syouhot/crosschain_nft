import { developmentChains, networkConfig } from "../helper-hardhat-config";
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;
    let sourceChainRouter, linkTokenAddr;
    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()//源码中的方法,可参考github文档
        sourceChainRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        sourceChainRouter = networkConfig[network.config.chainId].router
        linkTokenAddr = networkConfig[network.config.chainId].linkToken
    }
    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddress = wnftDeployment.address;
    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args: [destinationChainRouter, linkTokenAddr, wnftAddress]
    })
    log("NFTPoolBurnAndMint deployed successfully")

}

module.exports.tags = ["destchain", "all"]