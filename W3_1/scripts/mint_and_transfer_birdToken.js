const hre = require("hardhat");
const ethers = require("ethers");
const utils = ethers.utils;
const config = require("../hardhat.config")

const fs = require("fs");
const abiPath = "./artifacts/contracts/BirdToken.sol/Bird.json"
const abiData = require("../artifacts/contracts/BirdToken.sol/Bird.json").abi;
// console.log(abiData);
// var abiData = JSON.parse("{}");


const httpEndpoint = config.networks.bscTest.url;



const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const mintWallet = new ethers.Wallet(config.networks.bscTest.accounts[0], rpcProvider)
console.log(mintWallet.address)
const tokenContractAddress = "0x4C940735786BaA3AF6b453cB0D817748f751cBFa";
// const tokenABI = 
const tokenContract = new ethers.Contract(tokenContractAddress, abiData, mintWallet)

// console.log(tokenContract);
async function getTokenBalance() {
    console.log(await tokenContract.balanceOf(mintWallet.address));
}
async function mintToken() {
    
    await tokenContract.mintToken(100).then((r) => {
        console.log(r);  // 返回值不是true
        // this.getInfo();
      });
}
async function transferToken(address,amount){
    await tokenContract.transfer(utils.getAddress(address), utils.parseEther('10.0')).then((r) => {
        console.log(r);  // 返回值不是true
        // this.getInfo();
      });
}
// console.log("1"+"0"*18);
transferToken("0x8888888888882Ed8fC39A8b16ee2C448d1ef5aFe", 100);

