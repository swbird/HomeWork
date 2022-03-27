let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

   
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let FlashLoaner = await ethers.getContractFactory("flashLoaner");

    let uniswapV2Factory = ethers.utils.getAddress("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
    let flashLoaner = await FlashLoaner.deploy(ethers.utils.getAddress("0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"),uniswapV2Factory);
    await writeAddr(flashLoaner.address, "flashLoaner", network.name);
    console.log("flashLoaner:" + flashLoaner.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });