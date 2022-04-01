let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

   
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let USDT = await ethers.getContractFactory("USDT");
    let myUSDT = await USDT.deploy();
    await writeAddr(myUSDT.address, "myUSDT", network.name);
    console.log("myUSDT:" + myUSDT.address);

    let CallOptionSimpleToken = await ethers.getContractFactory("CallOptionSimpleToken");
    let callOptionSimpleToken = await CallOptionSimpleToken.deploy(myUSDT.address, 3000);
    await writeAddr(callOptionSimpleToken.address, "callOptionSimpleToken", network.name);
    console.log("callOptionSimpleToken:" + callOptionSimpleToken.address);
    
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });