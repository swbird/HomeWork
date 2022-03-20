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



部署uniswapRouter,WETH,UniswapFactory,Mytoken命令: 
====> npx hardhat run .\scripts\deploy_router_factory_weth_mytoken.js --network bscTest

计算得到的 init_code_hash = 66d39a7b7b2af47738d7d9c336d353beace85cee043f9a1bfdadafbbb48666f4

部署market合约并测试添加流动性命令:
====> npx hardhat run .\scripts\deploy_market.js --network bscTest

AddLiquidityHash:
====> https://testnet.bscscan.com/tx/0x0617d68be012f60a937d574a0e631fee2d48f72e020d3ef0258d44a3c52f474a

buyTokenHash:
====> https://testnet.bscscan.com/tx/0x1ebf76518b36202af668173838b3494c3e566864335c0cf4620e29e03976d945


