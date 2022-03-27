let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

   
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let MyTokenA = await ethers.getContractFactory("MyTokenA");
    let myTokenA = await MyTokenA.deploy();
    await writeAddr(myTokenA.address, "myTokenA", network.name);
    console.log("myTokenA:" + myTokenA.address);

    let MyTokenB = await ethers.getContractFactory("MyTokenB");
    let myTokenB = await MyTokenB.deploy();
    await writeAddr(myTokenB.address, "myTokenB", network.name);
    console.log("myTokenB:" + myTokenB.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });