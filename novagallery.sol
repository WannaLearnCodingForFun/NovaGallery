// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtGallery is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("CyberGallery", "CYBART") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintArt(string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function getMyTokens() public view returns (uint256[] memory) {
        uint256 balance = balanceOf(msg.sender);
        uint256[] memory result = new uint256[](balance);
        uint256 index = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == msg.sender) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
}
