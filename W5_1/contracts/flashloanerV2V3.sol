//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IV3SwapRouter_rinkeby.sol";
// import "./interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import './libraries/UniswapV2Library.sol';
pragma abicoder v2;

contract  flashLoaner is Ownable, IUniswapV2Callee{
    using SafeMath for uint;
    IV3SwapRouter public immutable uniswapV3Router;
    address V2Factory;
    address weth = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    constructor(IV3SwapRouter _swapRouter, address _v2factory)   {
        uniswapV3Router = _swapRouter;
        V2Factory = _v2factory;
    }
    receive() payable external {}
    // ISwapRouter.ExactInputSingleParams ExactInputSingleParams;

    function uniswapV3TestSwapETHToToken(address tokenOut, uint24 fee) public payable{
        IV3SwapRouter.ExactInputSingleParams memory params =  IV3SwapRouter.ExactInputSingleParams(
            {
                tokenIn: weth,
                tokenOut: tokenOut,
                fee: fee,
                recipient: msg.sender,
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            }
        );
        uniswapV3Router.exactInputSingle{value: msg.value}(
            params
        );
    }

    function uniswapV3TestSwap(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn) internal  returns (uint256 amountOut){
        
        
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


    function uniswapV3TestSwapETHToTokenByCall(address tokenOut, uint24 fee) public payable{
        IV3SwapRouter.ExactInputSingleParams memory params =  IV3SwapRouter.ExactInputSingleParams(
            {
                tokenIn: weth,
                tokenOut: tokenOut,
                fee: fee,
                recipient: msg.sender,
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            }
        );
        (bool success, bytes memory returnData) = address(uniswapV3Router).call{value:msg.value}(abi.encodeWithSignature("exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))", params));
        require(success, string(returnData));
    }

    // function swap(address _pair, uint amount0Out, uint amount1Out, bytes calldata data) public {
    //     IUniswapV2Pair pair = IUniswapV2Pair(_pair);
    //     pair.swap(amount0Out,amount1Out,address(this))
    // }

    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        // V3 MTB价格比V2贵

        // token0 :A 
        // token1 :B
        address MTA = 0x3aad0c76C69Be35960ae9A978E4dF4a5f856B85E;
        address MTB = 0x628FAaf0dC5e12fF2885F9d30e7Ce43c7F950eFa;
        address[] memory path = new address[](2);
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        require(msg.sender == UniswapV2Library.pairFor(V2Factory, token0, token1),'sender is not pair'); // ensure that msg.sender is actually a V2 pair
        assert(amount0 == 0 || amount1 == 0);
        path[0] = amount0 == 0 ? token0 : token1;
        path[1] = amount0 == 0 ? token1 : token0;
        
        uint amountTokenA;
        uint amountTokenB;
        amountTokenA = token0==MTA ? amount0 : amount1; // 如果token0==MTA , amountA=amount0, 输出的是tokenA, 
        amountTokenB = token0==MTA ? amount1 : amount0;


        if (amountTokenB>0){    // 如果输出的是TokenB,  将A还给Pair, 多余的A归自己
            // (uint minTokenA) = abi.decode(data, (uint)); // 最小的A输出量
            IERC20 tokenB = IERC20(MTB);
            tokenB.approve(address(uniswapV3Router), type(uint).max);
            IV3SwapRouter.ExactInputSingleParams memory params =  IV3SwapRouter.ExactInputSingleParams(
                {
                    tokenIn: MTB,
                    tokenOut: MTA,
                    fee: 3000,
                    recipient: address(this),
                    amountIn: amountTokenB,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                }
            );
            uint amountAReceived = uniswapV3Router.exactInputSingle(
                params
            ); 
            // uint amountAReceived = uniswapV3TestSwap(MTB, MTA, 3000, amountTokenB); // B 在V3换 A
            uint amountARequired = UniswapV2Library.getAmountsIn(V2Factory, amountTokenB, path)[0]; // path = [tokenA, tokenB]
            require(amountAReceived > amountARequired,'no enough token to repay');
            IERC20 tokenA = IERC20(MTA);
            assert(tokenA.transfer(msg.sender,amountARequired));
            assert(tokenA.transfer(owner(), amountAReceived - amountARequired));

        }else{ // 如果输出的是TokenA

        }
    }
}