const hre = require("hardhat");
const ethers = require("ethers");
const utils = ethers.utils;
const config = require("../hardhat.config")

const fs = require("fs");
const abiPath = "../artifacts/contracts/BirdNFT.sol/BirdNFT.json"
const abiData = require("../artifacts/contracts/BirdNFT.sol/BirdNFT.json").abi;
const ContractAddress = require("../deployments/bscTest/birdNFT.json").address
const tokenContractAddress = ContractAddress;
// console.log(abiData);
// var abiData = JSON.parse("{}");


const httpEndpoint = config.networks.bscTest.url;

const ContractAddress = require("../deployments/bscTest/birdNFT.json").address
const config = require("../hardhat.config")
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
async function mintToken(num) {
    
    await tokenContract.publicMint(num).then((r) => {
        console.log(r);  // 
        // this.getInfo();
      });
}
 function transferFrom(to,_id) {
    let overrides = {
        gasLimit: 123456,
        gasPrice: utils.parseUnits('19.0', 'gwei'),
        from: mintWallet.address,
        // chainId: config.networks.bscTest.chainId
    
    };
    return tokenContract.transferFrom(mintWallet.address, utils.getAddress(to), _id, overrides).then((r) => {
        console.log(r);  // 
        // this.getInfo();
      });
}

// mintToken(90);
// getTokenBalance() ;

transferFrom("0x672108336D05aCB5fBb1D9b596688deD43D22a9B" , 99);





