pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./v2-periphery/interfaces/IUniswapV2Router02.sol";
import "./IMasterChef.sol";

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}


contract MyTokenMarketPro is Ownable{
    using SafeMath for uint;
    IUniswapV2Router02 uniswapV2Router;
    address token;
    address uniswapV2RouterAddr;
    IERC20 Token;
    address weth;
    mapping(address=>uint) public masterChefDepositAmount;
    constructor(address _uniswapV2Router,address _token) public payable{
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

    function AddLiquidityAndDepositOnMasterChef(uint tokenAmount, address MasterChefAddr,uint pid ) public payable{
        uint ethAmount = msg.value;
        Token.transferFrom(msg.sender, address(this), tokenAmount);
        Token.approve(uniswapV2RouterAddr, ~uint(0)); // 授权合约中的Token到Router...
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            token,
            tokenAmount,
            0,
            0,
            address(this),
            block.timestamp
        );
        IUniswapV2Factory factory = IUniswapV2Factory(uniswapV2Router.factory()); // 初始化factory
        address pairAddr = factory.getPair(weth, token); // 获得lp地址
        IERC20 pair = IERC20(pairAddr);
        pair.approve(MasterChefAddr, ~uint(0)); // 授权合约中的Pair到MasterCHef...

        IMasterChef masterChef = IMasterChef(MasterChefAddr);
        masterChef.deposit(pid, pair.balanceOf(address(this))); // 完成质押
        masterChefDepositAmount[address(this)] += pair.balanceOf(address(this));
    }

    function withdrawFromMasterChef(address MasterChefAddr, uint pid)public{
        uint amount = masterChefDepositAmount[address(this)];
        IMasterChef masterChef = IMasterChef(MasterChefAddr);
        masterChef.withdraw(pid, amount); // 完成质押
        masterChefDepositAmount[address(this)] -= amount;
        IUniswapV2Factory factory = IUniswapV2Factory(uniswapV2Router.factory()); // 初始化factory
        address pairAddr = factory.getPair(weth, token); // 获得lp地址
        IERC20 pair = IERC20(pairAddr);
        pair.transfer(msg.sender, pair.balanceOf(address(this)));

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
