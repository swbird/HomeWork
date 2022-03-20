let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const config = require("../hardhat.config");

const httpEndpoint = config.networks.bscTest.url;


const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const Wallet = new ethers.Wallet(config.networks.bscTest.accounts[0], rpcProvider);
const abiData = require("../artifacts/contracts/MyToken.sol/MyToken.json").abi;
const ContractAddress = "0xEBa4861bb14e7Bc90fF91735A5d0B0181eBFE421"//require("../deployments/bscTest/MyToken.json").address;
const tokenContract = new ethers.Contract(ContractAddress, abiData, Wallet);
const routerAddr = require("../deployments/bscTest/uniswapV2Router02.json").address;
const abiRouter = require("../artifacts/contracts/v2-periphery/UniswapV2Router02.sol/UniswapV2Router02.json").abi;
const routerContract = new ethers.Contract(routerAddr, abiRouter, Wallet);


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();


    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    
    // let tokenAddr = "0xb5819aBFaD78e00b3FF82b3FBBa7E9ccbbfB69d5";

    let b = await tokenContract.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));
    await tokenContract.approve(routerAddr, ethers.constants.MaxUint256);
    let r = await routerContract.addLiquidityETH(
        ContractAddress,
        ethers.utils.parseUnits("100000", 18),
        0,
        0,
        Wallet.address,
        1111111111111,
        { value: ethers.utils.parseUnits("0.01", 18),gasLimit: 20000000 }
    )
    console.log(r);
}

 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });