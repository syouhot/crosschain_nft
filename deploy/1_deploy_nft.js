module.exports = async ({getNamedAccounts, deployments})=>{
    const {firstAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;
    await deploy("MyToken",{
        from:firstAccount,
        args:["MyToken","MT"],
        log:true
    })
    log("nft contract deployed successfully")
}

module.exports.tags=["all","sourcechain"]