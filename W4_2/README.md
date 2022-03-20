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

部署MasterChef和SushiToken:
    run: npx hardhat run .\scripts\deploy_sushi_and_masterChef.js --network bscTest


调试MasterChef和SushiToken:
    run: npx hardhat run .\scripts\masterChef_op.js --network bscTest

转移sushiToken权限到MasterChef合约:

    https://testnet.bscscan.com/tx/0x468af03939fca3203bb909907fe163355f08a34a44f58cc145bb2b5e3b4933d1

在MasterChef合约中添加第一个Pool:
    https://testnet.bscscan.com/tx/0x2b95d5d173b8addd18679e29297a1ac5b3b04396fa8d1c59cdde82db11bdb3ae

在MasterChef中Deposit LPToken:
    https://testnet.bscscan.com/tx/0x5f1b1ad893a15a6c56c2dba77a7ac3bc6756b6e7528d7a37bb4af7909f059a4e

取出MasterChef中的LP并提取sushi奖励:
    https://testnet.bscscan.com/tx/0xa367c80c8168a42e2b98a1ed44d3131489eea40ef8d5f0ec7cef9f93d2e6619b


部署MyTokenMarketPro合约:
    https://testnet.bscscan.com/tx/0xec6afe35291493a14d88e2a9ab8fd86e415ae7fad6789256e12fe1a95243b6a8


完成代币兑换后,直接质押MasterChef ( AddLiquidityAndDepositOnMasterChef):
    https://testnet.bscscan.com/tx/0xfc0e3c7bb4b7ec03ab36f835ad13df390f5ada6c3a1406ffbefc79be2bd18fd1

withdraw():从 MasterChef 提取 Token 方法:
    https://testnet.bscscan.com/tx/0x152706ef1fcee3b7f0038f81232c9831d3bc5a509d3226c7479890ac6a075d7c
