import { developmentChains } from "../helper-hardhat-config";


module.exports = async ({ getNamedAccounts, deployments }) => {
    if (developmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts();
        const { deploy, log } = deployments;
        await deploy("CCIPLocalSimulator", {
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            log: true,
            args: []
        })
        log("ccip simulator deployed successfully")
    }
}

module.exports.tags = ["all", "test"]