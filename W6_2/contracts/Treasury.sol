pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
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


contract Treasury is Ownable{
    event EtherReceived(address from, uint value, uint timestamp);
    event withdrawOp(address to, uint value);
    event Erc20WithdrawOp(address token, address to, uint amount );
    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }
    constructor(address gov) public {
        require(isContract(gov),'eoa addr is not allowed.');
        transferOwnership(gov); // 转移合约所有权到gov
    }
    receive () payable external {
        emit EtherReceived(msg.sender, msg.value, block.timestamp);
    }
    using SafeMath for uint;
    function doNothing() public payable {
        
    }
    function withdraw(address to, uint amount) external onlyOwner {
        // console.log("In Treasury.sol, msgSender=%s, owner=%s",msg.sender,owner());
        TransferHelper.safeTransferETH(to, amount);
        emit withdrawOp(to, amount);
    }
    function withdrawERC20(address token, uint amount, address to) external onlyOwner{
        TransferHelper.safeTransfer(token, to, amount);
        emit Erc20WithdrawOp(token, to, amount);
    }
}
