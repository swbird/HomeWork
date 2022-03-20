let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const config = require("../hardhat.config");
const httpEndpoint = config.networks.bscTest.url;


const rpcProvider = new ethers.providers.JsonRpcProvider(httpEndpoint);
// console.log(hre.accounts);
const Wallet = new ethers.Wallet(config.networks.bscTest.accounts[0], rpcProvider);


const MasterChefContractAddress = require("../deployments/bscTest/MasterChef.json").address;
const MasterChefABI = require("../artifacts/contracts/MasterChef.sol/MasterChef.json").abi;
const MasterChefContract = new ethers.Contract(MasterChefContractAddress, MasterChefABI, Wallet);


const SushiTokenContractAddress = require("../deployments/bscTest/SushiToken.json").address;
const SushiTokenABI = require("../artifacts/contracts/SushiToken.sol/SushiToken.json").abi;
const SushiTokenContract = new ethers.Contract(SushiTokenContractAddress, SushiTokenABI, Wallet);

const MyTokenMarketProAddress = require("../deployments/bscTest/MyTokenMarketPro.json").address;
const MyTokenMarketProABI = require("../artifacts/contracts/MyTokenMarketPro.sol/MyTokenMarketPro.json").abi;
const MyTokenMarketProContract = new ethers.Contract(MyTokenMarketProAddress, MyTokenMarketProABI, Wallet);

const TokenabiData = require("../artifacts/contracts/MyToken.sol/MyToken.json").abi;
const TokenContractAddress = require("../deployments/bscTest/MyToken.json").address;
const tokenContract = new ethers.Contract(TokenContractAddress, TokenabiData, Wallet);




async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let TokenLPAddr = ethers.utils.getAddress("0xb4B570eF5859189d682212A868B13FC7e6546Ed7"); // NEW LP地址
    let TokenLPABI = SushiTokenABI;
    let TokenLPContract =  new ethers.Contract(TokenLPAddr, TokenLPABI, Wallet);
    
    
    let init = ethers.utils.formatUnits(await MasterChefContract.poolLength(), 0)==0 ? true:false; // 根据池子长度判断是否是第一次运行
    let needbeApprove = ethers.utils.formatUnits(await TokenLPContract.allowance(Wallet.address, MasterChefContractAddress), 0)==0 ? true:false;;
    // console.log(init, ethers.utils.formatUnits(await MasterChefContract.poolLength(), 0));
    // console.log(ethers.utils.formatUnits(await TokenLPContract.allowance(Wallet.address, MasterChefContractAddress), 0));
     // 转移sushi-token的Owner权限
    if (init){
        let txTransferOwnerShip = await SushiTokenContract.transferOwnership(
            MasterChefContractAddress
        );
        console.log("txTransferOwnerShip->",txTransferOwnerShip)
    
        // 增加一个新池子
        let _allocPoint = 2;
        let _withUpdate = true;
        let masterChefaddTx = await MasterChefContract.add(
            _allocPoint,
            TokenLPAddr,
            _withUpdate
        );
        console.log("masterChefaddTx->",masterChefaddTx)
    }
    // For Test.
    if (needbeApprove){
        console.log(await TokenLPContract.approve(MasterChefContractAddress, ethers.constants.MaxUint256));
    }
    

    // let masterChefdepositTx = await MasterChefContract.deposit(
    //    0,
    //    ethers.utils.parseUnits("1",18)
    // );
    // console.log(masterChefdepositTx);

    
    
    // let masterChefwithdrawTx = await MasterChefContract.withdraw(
    //     0,
    //     ethers.utils.parseUnits("1",18)
    //  );
    //  console.log(masterChefwithdrawTx);
    
    // console.log(await MyToken.approve(MasterChefContractAddress, ethers.constants.MaxUint256));

    // console.log(await tokenContract.approve(MyTokenMarketProAddress, ethers.constants.MaxUint256)); // 授权到新的合约（MyMarketPro）

    // let AddLiquidityTx = await MyTokenMarketProContract.AddLiquidity(
    //     ethers.utils.parseUnits("100", 18),
    //     { value: ethers.utils.parseUnits("0.05", 18),gasLimit: 20000000}
    // );

    // console.log(AddLiquidityTx);
    
    

     let AddLiquidityAndDepositOnMasterChefTx = await MyTokenMarketProContract.AddLiquidityAndDepositOnMasterChef(
            ethers.utils.parseUnits("1000", 18),
            MasterChefContractAddress,
            1,{ value: ethers.utils.parseUnits("0.01", 18),gasLimit: 20000000 }
     );

     console.log("AddLiquidityAndDepositOnMasterChefTx: "+AddLiquidityAndDepositOnMasterChefTx);
        
    

    let withdrawFromMasterCheftx = await MyTokenMarketProContract.withdrawFromMasterChef(
        MasterChefContractAddress,
        1
    );

    console.log("withdrawFromMasterCheftx: "+await withdrawFromMasterCheftx);
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });