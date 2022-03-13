
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract Valut is Ownable{
    using SafeMath for uint;
    receive () payable external {

    }
    mapping (address=>uint) public userAssestinfo;
    address private defaultToken  = address(0x4C940735786BaA3AF6b453cB0D817748f751cBFa); //
    IERC20 token = IERC20(defaultToken);
    event depositeEvent(address user,uint amount,uint time);
    event withdrawEvent(address user,uint amount,uint time);
    function changeDefaultToken(address _token) external onlyOwner{
        token = IERC20(_token);
    }
    function deposite(uint amount) external {
        uint allowance = token.allowance(msg.sender, address(this));
        require(allowance>=amount,"need to approve first.");
        token.transferFrom(msg.sender, address(this), amount);
        userAssestinfo[msg.sender] = userAssestinfo[msg.sender].add(amount);
        emit depositeEvent(msg.sender,amount,block.timestamp);
    }

    function withdraw(uint amount) external {
        uint balance = userAssestinfo[msg.sender];
        require(balance>=amount,"Insufficient balance.");
        token.transfer(msg.sender, amount);
        userAssestinfo[msg.sender] = balance.sub(amount);
        emit withdrawEvent(msg.sender,amount,block.timestamp);
    }
    

}