// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;


interface IMintingoCollection {

function reveal(uint256[] memory  _winners, uint256[] memory  tiers, string memory  revealed_uri) external ;
function mint(uint256 _mintAmount, address coin, address user) external;

function setVariables(uint256 _start_block, uint256 _expiration, uint256 _supply,
        string memory _initNotRevealedUri) external;

}