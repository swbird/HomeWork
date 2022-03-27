pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./v2-periphery/interfaces/IUniswapV2Router02.sol";

contract MyTokenMarket is Ownable{
    using SafeMath for uint;
    IUniswapV2Router02 uniswapV2Router;
    address token;
    address uniswapV2RouterAddr;
    IERC20 Token;
    address weth;
    constructor(address _uniswapV2Router,address _token) public  payable{
        uniswapV2Router = IUniswapV2Router02(_uniswapV2Router);
        token = _token;
        Token = IERC20(_token);
        weth = uniswapV2Router.WETH();
        uniswapV2RouterAddr = _uniswapV2Router;
    }
    function AddLiquidity(uint tokenAmount) public payable{
        uint ethAmount = msg.value;
        Token.transferFrom(msg.sender, address(this), tokenAmount);
        Token.approve(uniswapV2RouterAddr, ~uint(0)); // 授权合约中的Token到Router...
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            token,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }
    function buyToken() public payable{
        uint ethAmount = msg.value;
        address[] memory path;
        path = new address[](2);
        path[0] = weth;
        path[1] = token;
        uniswapV2Router.swapExactETHForTokens{value: ethAmount}(
            0,
            path,
            msg.sender,
            block.timestamp
        );      
    }
    function sellToken(uint tokenAmount) public {
        address[] memory path;
        path = new address[](2);
        path[0] = token;
        path[1] = weth;
        uniswapV2Router.swapExactTokensForETH(
            tokenAmount,
            0,
            path,
            msg.sender,
            block.timestamp
        );      
    }

}
