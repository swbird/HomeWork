// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers;
function wait(ms) {
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Counter = await hre.ethers.getContractFactory("counter");
  const counter = await Counter.deploy();

  await counter.deployed();

  console.log("counter deployed to:", counter.address);

  console.log("init count is ", ethers.utils.formatUnits (await counter.show(), 0) ); // 
  let tx_add = await counter.add();
  console.log("tx_add=>",tx_add.hash);
  await wait(15000);
  console.log("behind add operation count is ",ethers.utils.formatUnits (await counter.show(), 0));
  let tx_set = await counter.set(100);
  console.log("tx_set=>",tx_set.hash);
  await wait(15000);
  console.log("behind set operation count is ",ethers.utils.formatUnits (await counter.show(), 0));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
