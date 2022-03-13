//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bird is ERC20, Ownable {

    constructor() ERC20("BirdToken", "Bird") {
        // _mint(msg.sender, 1000 * 10 ** 18);
    }
    function mintToken(uint num) external onlyOwner{
        // require()
        _mint(msg.sender, num * 10 ** 18);
    }
}