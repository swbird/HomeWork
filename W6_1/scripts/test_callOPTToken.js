let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const config = require("../hardhat.config");
const httpEndpoint = config.networks.Rinkeby.url;


const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const Wallet = new ethers.Wallet(config.networks.Rinkeby.accounts[0], rpcProvider);


const USDTAddress = require("../deployments/Rinkeby/myUSDT.json").address;
const USDTABI = require("../artifacts/contracts/MyUSDT.sol/USDT.json").abi;
const USDT = new ethers.Contract(USDTAddress, USDTABI, Wallet);

const CallOPTTokenAddress = require("../deployments/Rinkeby/callOptionSimpleToken.json").address;
const CallOPTTokenABI = require("../artifacts/contracts/CallOptionSimpleToken.sol/CallOptionSimpleToken.json").abi;
const CallOPTToken = new ethers.Contract(CallOPTTokenAddress, CallOPTTokenABI, Wallet);

console.log(USDTAddress, CallOPTTokenAddress);

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();
    if (false){ // mint Token
        
        let mintTx = await CallOPTToken.mintCOSToken({
            value: ethers.utils.parseUnits("0.1",18),
        });
        console.log(mintTx);
    }
    if (true){ // 
        let approveTx = await USDT.approve(CallOPTTokenAddress, ethers.constants.MaxUint256);
        console.log("approveTx->", approveTx);
        var amount = await CallOPTToken.balanceOf(Wallet.address);
        let becomeVestedTx = await CallOPTToken.becomeVested(amount);
        console.log("becomeVestedTx->", becomeVestedTx);
        
    }
    
    
}
main().then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});
    