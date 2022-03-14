const hre = require("hardhat");
const ethers = require("ethers");
const utils = ethers.utils;
const config = require("../hardhat.config")

const fs = require("fs");
// const abiPath = "../artifacts/contracts/BirdNFT.sol/BirdNFT.json"
const abiData = require("../artifacts/contracts/BirdNFT.sol/BirdNFT.json").abi;
// console.log(abiData);
// var abiData = JSON.parse("{}");

const ContractAddress = require("../deployments/bscTest/birdNFT.json").address
const tokenContractAddress = ContractAddress;

const httpEndpoint = config.networks.bscTest.url;



const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const mintWallet = new ethers.Wallet(config.networks.bscTest.accounts[0], rpcProvider)
console.log(mintWallet.address)

// const tokenABI = 
const tokenContract = new ethers.Contract(tokenContractAddress, abiData, mintWallet)

// console.log(tokenContract);
async function getTokenBalance() {
    console.log(await tokenContract.balanceOf(mintWallet.address));
}
async function mintToken() {
    
    await tokenContract.publicMint().then((r) => {
        console.log(r);  // 
        // this.getInfo();
      });
}
async function transferFrom(to,_id) {
    
    await tokenContract.transferFrom(mintWallet.address, utils.getAddress(to), _id).then((r) => {
        console.log(r);  // 
        // this.getInfo();
      });
}

let filter = {
    address: tokenContractAddress,
    topics: [
        utils.id("Transfer(address,address,uint256)"),
        utils.hexZeroPad(mintWallet.address, 32)
    ]
}
console.log(filter)
console.log(tokenContract.filters.Transfer(mintWallet.address))
tokenContract.on(filter, (from, to, id) => {
    console.log(to, 'received tokenid=' + id.toString() + ' from ' + from);
});
// mintToken();
// getTokenBalance() ;
// transferFrom("0x672108336D05aCB5fBb1D9b596688deD43D22a9B",0);

