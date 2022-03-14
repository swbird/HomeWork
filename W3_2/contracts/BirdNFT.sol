pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BirdNFT is ERC721{
    constructor() ERC721("BirdNFT", "BirdNFT") {
        // _mint(msg.sender, 1000 * 10 ** 18);
    }
    uint id = 0;
    uint public maxSupply = 100;


    function publicMint(uint num) external{
        require(id+num<=maxSupply,"no enough nft.");
        uint temp = 0;
        for(uint i=0;i<num;){
            _safeMint(msg.sender, id+temp, "");
            unchecked{
                i++;
                temp+=1;
            }
        }
        unchecked{
            id+=temp;
        }
    }
}