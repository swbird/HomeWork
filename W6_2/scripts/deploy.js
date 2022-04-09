// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const {utils } = require("ethers").utils;
const hre = require("hardhat");
let { writeAddr } = require('./artifact_log.js');

async function showBalance(address){
  let bal =  ethers.utils.formatUnits(await hre.ethers.provider.getBalance(address), "18") ;
  console.log(address, "余额是", bal); // Object.keys({address})[0]
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let [owner, second, _3, _4,_5,_6] = await ethers.getSigners();

  await showBalance(owner.address);
  await showBalance(second.address);
  await showBalance(_3.address);
  await showBalance(_4.address);
  await showBalance(_5.address);
  
  

  const GOV = await hre.ethers.getContractFactory("GOV");
  let _DAOMembers = [owner.address, second.address, _3.address, _4.address,_5.address];
  const gov = await GOV.deploy(_DAOMembers, _DAOMembers.length-1);
 
  await gov.deployed();
  await writeAddr(gov.address, "gov", network.name);
  console.log("gov deployed to:", gov.address);

  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(gov.address);
  await treasury.deployed();
  await writeAddr(treasury.address, "treasury", network.name);
  console.log("treasury deployed to:", treasury.address);

  let tx_transferETHtoTreasury = await treasury.connect(_6).doNothing({value: ethers.utils.parseEther("100")}); // 普通用户向合约转账100ether


  console.log("tx_transferETHtoTreasury(普通用户向Treasury合约转账100ether)=>", tx_transferETHtoTreasury.hash);
  let address_to_receiver = _5.address;
  let _value = ethers.utils.parseEther("100");
  let methodName = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("withdraw(address,uint256)")).toString().substr(0,10);
  let params =  ethers.utils.defaultAbiCoder.encode(["address","uint256"],[address_to_receiver, _value]).replace("0x","");
  let data = methodName+params;
  

//    +
  // console.log(data);
  let address_to = treasury.address;
  let tx_submitTransaction = await gov.submitTransaction(
    address_to,
    ethers.utils.parseEther("0"),
    data
  );
  // console.log(address_to, _value, data);
  
  console.log("tx_submitTransaction(gov成员1 提交一个提案)=>",tx_submitTransaction.hash)
  console.log("提案内容: 调用Treasury合约的Withdraw方法 向 gov成员5 提取 100 ether");
  var _txIndex = 0;
  // console.log(owner.address,second.address,_3.address,_4.address,_5.address);
  let tx_confirmTransaction_1 = await gov.connect(owner).confirmTransaction(_txIndex);
  console.log("tx_confirmTransaction_1(gov成员1投票确认该交易)=>",tx_confirmTransaction_1.hash)
  let tx_confirmTransaction_2 = await gov.connect(second).confirmTransaction(_txIndex);
  console.log("tx_confirmTransaction_2(gov成员2投票确认该交易)=>",tx_confirmTransaction_2.hash)
  let tx_confirmTransaction_3 = await gov.connect(_3).confirmTransaction(_txIndex);
  console.log("tx_confirmTransaction_3(gov成员3投票确认该交易)=>",tx_confirmTransaction_3.hash)
  let tx_confirmTransaction_4 = await gov.connect(_4).confirmTransaction(_txIndex);
  console.log("tx_confirmTransaction_4(gov成员4投票确认该交易)=>",tx_confirmTransaction_4.hash)
  let tx_confirmTransaction_5 = await gov.connect(_5).confirmTransaction(_txIndex);
  console.log("tx_confirmTransaction_5(gov成员5投票确认该交易)=>",tx_confirmTransaction_5.hash)
  // Execute confirm 
  // console.log(tx_confirmTransaction_1.hash, tx_confirmTransaction_2.hash, tx_confirmTransaction_3.hash, tx_confirmTransaction_4.hash, tx_confirmTransaction_5.hash);

  let tx_executeTransaction = await gov.connect(owner).executeTransaction(_txIndex);
  console.log("tx_executeTransaction((gov成员1执行认该交易,投票数满足>=4)=>", tx_executeTransaction.hash);

  await showBalance(owner.address);
  await showBalance(second.address);
  await showBalance(_3.address);
  await showBalance(_4.address);
  await showBalance(_5.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
