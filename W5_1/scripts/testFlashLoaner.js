let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const config = require("../hardhat.config");
const httpEndpoint = config.networks.Rinkeby.url;


const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const Wallet = new ethers.Wallet(config.networks.Rinkeby.accounts[0], rpcProvider);


const FlashLoaner = require("../deployments/Rinkeby/flashLoaner.json").address;
const FlashLoanerABI = require("../artifacts/contracts/flashloanerV2V3.sol/flashLoaner.json").abi;
const FlashLoanerContract = new ethers.Contract(FlashLoaner, FlashLoanerABI, Wallet);

const daiAddr = ethers.utils.getAddress("0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"); // DAI
const wethAddr = ethers.utils.getAddress("0xc778417e063141139fce010982780140aa0cd5ab"); // WETH
const ERC20ABI = require("../artifacts/contracts/MyTokenA.sol/MyTokenA.json").abi;

const DAI = new ethers.Contract(daiAddr, ERC20ABI, Wallet);
const WETH = new ethers.Contract(wethAddr, ERC20ABI, Wallet);

const pairAddr = ethers.utils.getAddress("0xAf3fCd06CCDD0c24797FB3aACaa0BaD5101d2053");
const pairABI = require("./PairABI.json");
const pairContract = new ethers.Contract(pairAddr, pairABI, Wallet);
async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    var tokenIn = daiAddr; // DAI

    var tokenOut = wethAddr; // WETH

    // let approveTx = await DAI.approve(FlashLoaner, ethers.constants.MaxUint256);
    // console.log('ApproveTx=>', approveTx)

    let AmountIn = ethers.utils.parseUnits("11",18);
    let override = {
        // value: AmountIn,
        // gasLimit: 2000000,
        // gasPrice: ethers.utils.parseUnits("10",9)
    }
    let swapTx = await pairContract.swap(
        0,
        ethers.utils.parseUnits("1000", 18),
        FlashLoaner,
        ethers.utils.defaultAbiCoder.encode(["uint256"],[1])
    );
    console.log("swapTx->",swapTx.hash);

    // let tx1 = await FlashLoanerContract.uniswapV3TestSwapETHToTokenByCall(
    //     daiAddr,
    //     10000,
    //     {
    //         value: ethers.utils.parseUnits("0.001",18),
    //         // gasLimit: 2000000
    //     }
    // );
    // console.log(tx1);


} 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });