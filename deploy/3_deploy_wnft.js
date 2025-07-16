module.exports = async ({getNamedAccounts, deployments})=>{
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;
    await deploy("WrappedMyToken",{
        from:firstAccount,
        args:["WrappedMyToken","WMT"],
        log:true
    })
    log("wnft contract deployed successfully")
}

module.exports.tags=["all","destchain"]