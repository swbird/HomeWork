pragma solidity ^0.8.0;
contract counter {
    uint256 public count;
    function add() external{
        count+=1;
    }
    function show() public view returns(uint256){
        return count;
    }
}