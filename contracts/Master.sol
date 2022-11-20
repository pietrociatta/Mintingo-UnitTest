// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IMintingoCollection.sol";
import "./Mintingocollection.sol";

// Mintingo Master Contract
contract Master is Ownable, ReentrancyGuard {   
    using Strings for uint256;

    mapping(uint256 => address) public collections;
    mapping(address => uint256[]) winners_by_collection;
    mapping(address => uint256) players_wins;
    mapping(address => uint256) players_attempts;
    address[] public collections_ids; // the last one (tail) is the current collection

  
    // create a new collection deploying a new Collection(ERC721) contract
    function  create_collection(
        string memory _name,
        string memory _symbol, uint256[] memory totalClaimable, uint[] memory tiers, address[] memory coins, uint256[] memory amounts, address[] memory coin_to_pay, address[] memory nfts, uint256[] memory price_to_pay , address _master
    ) public onlyOwner() {
        MintingoCollection collection = new MintingoCollection(_name, _symbol, totalClaimable, tiers, coins, amounts, coin_to_pay, nfts, price_to_pay, _master);
        address collection_address = address(collection);
        collections_ids.push(collection_address);
        collections[collections_ids.length - 1] = collection_address;
    }

    function  reveal_by_id(
        address collection_id,
        uint256[] memory winners,
        uint256[] memory tiers,
        string memory revealed_uri
    ) public {
      
        winners_by_collection[collection_id] = winners;
        IMintingoCollection(collection_id).reveal(winners, tiers, revealed_uri);
    }

//    function   get_collection_address(uint256 collection_id) private returns(address){
//         require(collections[collection_id] != address(0), 'COLLECTION_DNE');
//         return /*import interface di mintingo */ IMintingoCollection(collections[collection_id]);
//         // check ierc20 interfect per vedere come farlo
//     }

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
      

        // merkle proof to check if the user is a winner
        // if he is a winner, then he can claim his reward
        // if he is not a winner, then he can't claim his reward
    

        // HERE IT MUST SENDS 10% TO ADMIN & 10% TO REFERRALS

        // CHECK for ticket.nfts sender holdings

        // collection.mint(...)

    }

    event CollectionCreated(address indexed addr, uint256 indexed id, uint256 supply);
    event CollectionRevealed(address indexed addr, uint256 indexed id );

}