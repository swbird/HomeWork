let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let SushiToken = await ethers.getContractFactory("SushiToken");
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let sushiToken = await SushiToken.deploy();
    await sushiToken.deployed();
    await writeAddr(sushiToken.address, "sushiToken", network.name);
    console.log("sushiToken:" + sushiToken.address);
    
    let bn = await ethers.provider.getBlockNumber();
    console.log(bn);

    let MasterChef = await ethers.getContractFactory("MasterChef");
    let masterChef = await MasterChef.deploy(
        sushiToken.address,
        owner.address,
        ethers.utils.parseUnits("100", 18),
        bn,
        bn+1000000
    );
    await writeAddr(masterChef.address, "masterChef", network.name);
    console.log("masterChef:" + masterChef.address);
    
    

    



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });