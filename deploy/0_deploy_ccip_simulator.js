module.exports = async ({getNamedAccounts, deployments})=>{
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;
    await deploy("CCIPLocalSimulator",{
        contract:"CCIPLocalSimulator",
        from: firstAccount,
        log:true,
        args:[]
    })
    log("ccip simulator deployed successfully")
}

module.exports.tags = ["all","test"]