let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const config = require("../hardhat.config");
const abiData = require("../artifacts/contracts/MyToken.sol/MyToken.json").abi;
const httpEndpoint = config.networks.bscTest.url;

const ContractAddress = require("../deployments/bscTest/MyToken.json").address
const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const Wallet = new ethers.Wallet(config.networks.bscTest.accounts[0], rpcProvider);
const tokenContract = new ethers.Contract(ContractAddress, abiData, Wallet);
const routerAddr = require("../deployments/bscTest/uniswapV2Router02.json").address;
const abiRouter = require("../artifacts/contracts/v2-periphery/UniswapV2Router02.sol/UniswapV2Router02.json").abi;
const routerContract = new ethers.Contract(routerAddr, abiRouter, Wallet);
const tokenAddr = require("../deployments/bscTest/myToken.json").address;

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();



    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    
    // let tokenAddr = "0xC652191d8Ba6Bd2256E78D9079036332fAF2BDCF";

    // let b = await tokenContract.balanceOf(owner.address);
    // console.log("持有token:" + ethers.utils.formatUnits(b, 18));
    
    let market = await MyTokenMarket.deploy(
        routerAddr, tokenAddr
    );

    await market.deployed();
    console.log("market:" + market.address);

    await tokenContract.approve(market.address, ethers.constants.MaxUint256);
    let aAmount = await tokenContract.balanceOf(owner.address);
    
    let ethAmount = ethers.utils.parseUnits("0.1", 18);
    let addliqtx = await market.AddLiquidity(aAmount, { value: ethAmount,gasLimit: 20000000 });
    console.log("添加流动性ing",addliqtx);

    let b = await tokenContract.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("0.1", 18);
    let buyTokenTx = await market.buyToken({ value: buyEthAmount, gasLimit: 2000000 });
    console.log("buyTokenTx:" + buyTokenTx);

    b = await tokenContract.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });