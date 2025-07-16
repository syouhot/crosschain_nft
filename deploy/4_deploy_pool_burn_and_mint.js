const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator =await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeployment.address)

    const ccipConfig = await ccipSimulator.configuration()//源码中的方法,可参考github文档
    const destinationChainRouter = ccipConfig.destinationRouter_;
    const linkTokenAddr = ccipConfig.linkToken_;
    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddress = wnftDeployment.address;
    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args:[destinationChainRouter,linkTokenAddr,wnftAddress]
    })
    log("NFTPoolBurnAndMint deployed successfully")

}

module.exports.tags = ["destchain","all"]