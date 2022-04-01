pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


library TransferHelper {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeApprove: approve failed'
        );
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeTransfer: transfer failed'
        );
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::transferFrom: transferFrom failed'
        );
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }
}

interface IERC20Pro is IERC20{
     function decimals() external view  returns (uint8);
}


contract CallOptionSimpleToken is ERC20("CallOptionSimpleToken", "COSToken") ,Ownable{
    using SafeMath for uint;
    uint public Price; // ETH行权价格
    uint public becomeVestedTime; // 行权日期
    uint public ValidityPeriod; // 行权有效期
    address public usdt;
    IERC20Pro USDT;
    uint public Token2ETHProportion = 10;
    constructor(address _usdt, uint price) public {
        usdt = _usdt;  // 
        USDT = IERC20Pro(usdt);
        Price = price; // 外部可设置 价格
        becomeVestedTime = block.timestamp + 1 hours; // 合约创建1小时候即可行权 方便测试
        ValidityPeriod = 1 days; // 行权有效期 1天
    }
    
    function mintCOSToken() public payable onlyOwner{
        _mint(msg.sender, msg.value.mul(Token2ETHProportion)); // 1 ether 对应 10 Token
    }

    function becomeVested(uint amount) public { // 行权 amount
        require(block.timestamp>=becomeVestedTime&&block.timestamp<=(becomeVestedTime+ValidityPeriod),"t err"); 
        _burn(msg.sender, amount);
        uint ethAmount = amount.div(Token2ETHProportion);
        uint decimalUsdt = uint256(USDT.decimals());
        uint uAmount = (ethAmount.mul(10**decimalUsdt).div(10**decimalUsdt)).mul(Price); // 如果U精度不是18, 计算精确的 uAmount
        // uint uAmount = ethAmount.mul(Price);
        // 外部approve
        TransferHelper.safeTransferFrom(usdt, msg.sender, address(this), uAmount);

        TransferHelper.safeTransferETH(msg.sender, ethAmount);
    }

    function withDrawAsset() public onlyOwner {
        require(block.timestamp>(becomeVestedTime+ValidityPeriod),'t1 err');
        TransferHelper.safeTransfer(usdt, owner(), USDT.balanceOf(address(this)));
        selfdestruct(payable(owner()));
    }

}