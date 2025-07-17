const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")
let firstAcount
let ccipSimulator
let nft
let nftPoolLockAndRelease
let wnft
let nftPoolBurnAndMint
let MyTokenDeployment
let nftPoolLockAndReleaseDeployment
let wnftDeployment
let nftPoolBurnAndMintDeployment
let chainSelector
before(async function () {
    firstAcount = (await getNamedAccounts()).firstAccount
    await deployments.fixture("all")
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator", firstAcount)
    MyTokenDeployment = await deployments.get("MyToken")
    nft = await ethers.getContractAt("MyToken", MyTokenDeployment.address)
    nftPoolLockAndReleaseDeployment = await deployments.get("NFTPoolLockAndRelease")
    nftPoolLockAndRelease = await ethers.getContractAt("NFTPoolLockAndRelease", nftPoolLockAndReleaseDeployment.address)
    wnftDeployment = await deployments.get("WrappedMyToken")
    wnft = await ethers.getContractAt("WrappedMyToken", wnftDeployment.address)
    nftPoolBurnAndMintDeployment = await deployments.get("NFTPoolBurnAndMint")
    nftPoolBurnAndMint = await ethers.getContractAt("NFTPoolBurnAndMint", nftPoolBurnAndMintDeployment.address)
    const config = await ccipSimulator.configuration()
    chainSelector = config.chainSelector_
})

describe("source chain -> dest chain tests", async function () {
    it("test if user can mint a nft form nft contract successfully", async function () {
        await nft.safeMint(firstAcount)
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(firstAcount)
    })
    it("test if user can lock a nft to nft pool and send ccip message on source chain", async function () {
        await nft.approve(nftPoolLockAndRelease.target, 0)
        await ccipSimulator.requestLinkFromFaucet(nftPoolLockAndRelease, ethers.parseEther("10"))
        await nftPoolLockAndRelease.lockAndSendNFT(0, firstAcount, chainSelector, nftPoolBurnAndMint.target)
        const owner = await nft.ownerOf(0)
        expect(owner).to.equal(nftPoolLockAndRelease)
    })
    it("test if user can get a wrapped nft in dest chain", async function () {
        const owner = await wnft.ownerOf(0)
        expect(owner).to.equal(firstAcount)
    })
    describe("dest chain -> source chain tests", async function () {
        it("test if user can burn the wnft and send ccip message on dest chain", async function () {
            await wnft.approve(nftPoolBurnAndMint.target, 0)
            await ccipSimulator.requestLinkFromFaucet(nftPoolBurnAndMint, ethers.parseEther("10"))
            await nftPoolBurnAndMint.burnAndSendNFT(0, firstAcount, chainSelector, nftPoolLockAndRelease.target)
            const totalSupply = await wnft.totalSupply()
            expect(totalSupply).to.equal(0)
        })
        it("test if user have the nft unlocked on source chain", async function () { 
            const owner = await nft.ownerOf(0)
            expect(owner).to.equal(firstAcount)
         })
    })
})