// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMintingoCollection.sol";
import "./Mintingocollection.sol";
import "./MasterLibrary.sol";
import "hardhat/console.sol";


// Mintingo Master Contract
contract Master is Ownable {   
    using Strings for uint256;

    mapping(uint256 => address) public collections;
    mapping(address => uint256[]) public winners_by_collection;
    mapping(address => uint256) public players_wins;
    mapping(address => uint256) public players_attempts;
    address[] public collections_ids; // the last one (tail) is the current collection

  
    // create a new collection deploying a new Collection(ERC721) contract
    function  create_collection(
        string memory _name,
        string memory _symbol, uint256[] memory totalClaimable, uint[] memory tiers, address[] memory coins, uint256[] memory amounts, address[] memory coin_to_pay, address[] memory nfts, uint256[] memory price_to_pay , address _master) public onlyOwner() {
        
      address newAddress =  MasterLibrary.lib_create_collection(_name, _symbol, totalClaimable, tiers, coins, amounts, coin_to_pay, nfts, price_to_pay, _master);  
      
        // MintingoCollection collection = new MintingoCollection(_name, _symbol, totalClaimable, tiers, coins, amounts, coin_to_pay, nfts, price_to_pay, _master);
        // address collection_address = address(collection);

        collections_ids.push(newAddress);
        collections[collections_ids.length - 1] = newAddress;
    }

    function  reveal_by_id(
        address collection_id,
        uint256[] memory winners,
        uint256[] memory tiers,
        string memory revealed_uri
    ) public {
        console.log("trigger");
        winners_by_collection[collection_id] = winners;
        IMintingoCollection(collection_id).reveal(winners, tiers, revealed_uri);
    }

    function set_variables(uint256 collection_id,uint256 _start_block, uint256 _expiration, uint256 _max_Supply, string memory _initNotRevealedUri) public  onlyOwner(){
     require(collections[collection_id] != address(0), 'COLLECTION_DNE');
    address collection_address = collections[collection_id];
    IMintingoCollection(collection_address).setVariables(_start_block, _expiration, _max_Supply, _initNotRevealedUri);
       
    }

    function  buy_ticket(uint256 collection_id, address coin, uint256 _mintAmount) public {
        /// TODO: if users lose X times in a row, then he has the right to get a free ticket.
        require(collections[collection_id] != address(0), 'COLLECTION_DNE');
      
        address collection_address = collections[collection_id];
 
        IMintingoCollection(collection_address).mint(_mintAmount, coin, msg.sender);
    }


}