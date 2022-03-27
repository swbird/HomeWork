# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

部署tokenA,tokenB:
    run: npx hardhat run .\scripts\deploy_tokenA_and_tokenB.js --network Rinkeby
部署 闪电贷合约:
    run: npx hardhat run '.\scripts\deploy_flashLoaner.js' --network Rinkeby
测试闪电贷:
    run: npx hardhat run .\scripts\testFlashLoaner.js --network Rinkeby


闪电贷套利hash:
    https://rinkeby.etherscan.io/tx/0x45430144ea7cc074bba9e19e307f39291695033f570be60f372b35d6446ee679

效果图:
    ![Image text](./闪电贷最终效果图.png)
