pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


import "./interfaces/IFlashLoanSimpleReceiver.sol";
import "./FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from './interfaces/IPoolAddressesProvider.sol';
import "./interfaces/IV3SwapRouter_rinkeby.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import './libraries/UniswapV2Library.sol';
import "./interfaces/IUniswapV2Router02.sol";
pragma abicoder v2;

contract test is FlashLoanSimpleReceiverBase , Ownable{
    using SafeMath for uint;
    IV3SwapRouter public immutable uniswapV3Router;
    IUniswapV2Router02 public immutable uniswapV2Router; 
    address weth = address(0x98a5F1520f7F7fb1e83Fe3398f9aBd151f8C65ed);
    constructor(IV3SwapRouter _V3swapRouter, IUniswapV2Router02 _V2swapRouter, address _addressProvider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))  public{
        //; 初始化 一下
        uniswapV3Router = _V3swapRouter;
        uniswapV2Router = _V2swapRouter;
    }

    function uniswapV3SwapInternal(address tokenIn, address tokenOut, uint256 amountIn) internal returns(uint amountOut){
        uint24 fee = 3000;
        IV3SwapRouter.ExactInputSingleParams memory params =  IV3SwapRouter.ExactInputSingleParams(
            {
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            }
        );
        amountOut = uniswapV3Router.exactInputSingle(
            params
        ); 
    }

    function uniswapV2SwapInternal(address tokenIn, address tokenOut, uint256 amountIn) internal returns(uint amountOut) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint[] memory amounts = uniswapV2Router.swapExactTokensForTokens(amountIn, 0, path, address(this), block.timestamp);
        amountOut = amounts[amounts.length-1]; // 获取amountOut
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool){
        require(asset!=weth, "asset can't be weth"); 
        require(IERC20(asset).balanceOf(address(this))>=amount,"no enough token balance."); // 检查资产余额
        // 假设 asset 在UniswapV2的价格高于UniswapV3
        IERC20 token_asset = IERC20(asset);
        token_asset.approve(address(uniswapV2Router), amount); // 授权asset 到 routerV2
        uint WETH_amountOut = uniswapV2SwapInternal(asset, weth, amount); // 兑换asset为WETH
        IERC20 WETH_token = IERC20(weth);
        WETH_token.approve(address(uniswapV3Router), WETH_amountOut); // 授权WETH到V3合约
        uint asset_amountOut = uniswapV3SwapInternal(weth, asset, WETH_amountOut); //  兑换WETH为asset
        uint totalDebt = amount.add(premium); // 计算总共应还数量
        require(asset_amountOut >= totalDebt, "no enough asset to repay");
        address poolAddr = address(POOL);
        token_asset.transfer(poolAddr, totalDebt);
        uint weth_profit_amount = WETH_token.balanceOf(address(this)); // 计算剩余的weth 数量
        WETH_token.transfer(owner(), weth_profit_amount); // 将利润转给owner
    }

    function flashloan(address _asset) public{
        bytes memory data = "";
        uint amount = 1 ether;
        uint16 referralCode = 0;
        IPool lendingPool = IPool(POOL); // 初始化Pool
        lendingPool.flashLoanSimple(
            address(this),
            _asset,
            amount,
            data,
            referralCode
        );
    }
}