let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
// const { writeAddr } = require('./artifact_log.js');


async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    // let aAmount = ethers.utils.parseUnits("100000", 18);
    let uniswapV2Factory = await UniswapV2Factory.deploy(ethers.utils.getAddress(owner.address));
    await uniswapV2Factory.deployed();
    await writeAddr(uniswapV2Factory.address, "uniswapV2Factory", network.name);
    console.log("uniswapV2Factory:" + uniswapV2Factory.address);
    let INIT_CODE_PAIR_HASH = await uniswapV2Factory.INIT_CODE_PAIR_HASH();
    console.log("INIT_CODE_PAIR_HASH:" + INIT_CODE_PAIR_HASH);

    let WETH = await ethers.getContractFactory("MyWETH");
    let weth = await WETH.deploy();
    await writeAddr(weth.address, "weth", network.name);
    console.log("WETH:" + weth.address);
    

    let UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    let uniswapV2Router02 = await UniswapV2Router02.deploy(ethers.utils.getAddress(uniswapV2Factory.address), ethers.utils.getAddress(weth.address));
    await writeAddr(uniswapV2Router02.address, "uniswapV2Router02", network.name);
    console.log("UniswapV2Router02:"+uniswapV2Router02.address);

    let MyToken = await ethers.getContractFactory("MyToken");
    let myToken = await MyToken.deploy();
    await writeAddr(myToken.address, "myToken", network.name);
    console.log("myToken:" + myToken.address);



    /**
     run result:
        INIT_CODE_PAIR_HASH:0x66d39a7b7b2af47738d7d9c336d353beace85cee043f9a1bfdadafbbb48666f4
     **/


    // let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    // let routerAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    // let wethAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // let market = await MyTokenMarket.deploy(
    //     atoken.address,
    //     routerAddr,
    //     wethAddr,
    // );

    // await market.deployed();
    // console.log("market:" + market.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });