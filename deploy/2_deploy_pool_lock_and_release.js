const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator =await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatorDeployment.address)

    const ccipConfig = await ccipSimulator.configuration()//源码中的方法,可参考github文档
    const sourceChainRouter = ccipConfig.sourceRouter_;
    const linkTokenAddr = ccipConfig.linkToken_;
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