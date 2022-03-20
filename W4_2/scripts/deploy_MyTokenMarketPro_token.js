let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

   
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let MyToken = await ethers.getContractFactory("MyToken");
    let myToken = await MyToken.deploy();
    await writeAddr(myToken.address, "myToken", network.name);
    console.log("myToken:" + myToken.address);

    let MyTokenMarketPro = await ethers.getContractFactory("MyTokenMarketPro");
    let myTokenMarketPro = await MyTokenMarketPro.deploy(
        "0xEaAf0aDE3Ed0573Fc40001C560fc003B574FC669", // Router
        myToken.address // MyToken
    );
    await myTokenMarketPro.deployed();
    await writeAddr(myTokenMarketPro.address, "myTokenMarketPro", network.name);
    console.log("myTokenMarketPro:" + myTokenMarketPro.address);
    
    

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });