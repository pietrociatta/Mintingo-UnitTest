const { ethers } = require('hardhat');
const {
  experimentalAddHardhatNetworkMessageTraceHook,
} = require('hardhat/config');

let masterContract;
let interfaceContract;
let mainContract;
let ownerAddress;
let ownerSigner;
let busdContract;
let usdcContract;
let ticketNftContract;
let addr1Address;
let addr1Signer;
let addr2;

let childContractAddress;
let childContract;

// Variables for child contract constructor
let _name = 'Child Contract';
let _symbol = 'CHILD';
let _totalClaimable = [300, 100, 200, 300, 400];
let _tiers = [0, 1, 2, 3, 4];
let _coins = [
  '0x0000000000000000000000000000000000000000',
  '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
  '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
  '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
  '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
];
let _amounts = [0, 10, 10, 10, 10];
let _coin_to_pay = [
  '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
  '0x72078aFBdFA85954298742922F2F53FC02ce9C3E',
];
let _nfts = ['0x869cC415833C9E8DbAc4Ea621B9E00eC5b3Fb661'];
let _price_to_pay = [5, 5];
let master;

// Variables for child contract functions //

// ---- ALL ADDRESS OF DEPLOYED CONTRACTS ---- //
/* 
Master Contract Library deployed to: 0x0008977945E80DA2f44Bee8D69670B9E23Af0B85
Master Contract deployed to: 0x0Ae4F70eB72D99050f6f245D89F519C806A2738b
BUSD Contract deployed to: 0xA31A578E30008E6cEfbC219C27694CBfE80119a4
USDC Contract deployed to: 0x72078aFBdFA85954298742922F2F53FC02ce9C3E
Ticket NFT Contract deployed to: 0x869cC415833C9E8DbAc4Ea621B9E00eC5b3Fb661
 */

async function main() {
  // ---- Before Each ---- //

  // // DEPLOY CHE LIBRARY MASTER CONTRACT
  // const MasterContractLibrary = await ethers.getContractFactory(
  //   'MasterLibrary'
  // );
  // const masterContractLibrary = await MasterContractLibrary.deploy();
  // await masterContractLibrary.deployed();
  // console.log(
  //   'Master Contract Library deployed to:',
  //   masterContractLibrary.address
  // );

  // // DEPLOY MASTER CONTRACT
  // const MasterContract = await ethers.getContractFactory('Master', {
  //   libraries: {
  //     MasterLibrary: masterContractLibrary.address,
  //   },
  // });
  // const masterContract = await MasterContract.deploy();
  // await masterContract.deployed();
  // console.log('Master Contract deployed to:', masterContract.address);

  // // DEPLOY BUSD CONTRACT
  // const BusdContract = await ethers.getContractFactory('BUSD');
  // const busdContract = await BusdContract.deploy();
  // await busdContract.deployed();
  // console.log('BUSD Contract deployed to:', busdContract.address);

  // // DEPLOY USDC CONTRACT
  // const UsdcContract = await ethers.getContractFactory('USDC');
  // const usdcContract = await UsdcContract.deploy();
  // await usdcContract.deployed();
  // console.log('USDC Contract deployed to:', usdcContract.address);

  // // DEPLOY TICKET NFT CONTRACT
  // const TicketNftContract = await ethers.getContractFactory('TicketNft');
  // const ticketNftContract = TicketNftContract.attach(
  //   '0x869cC415833C9E8DbAc4Ea621B9E00eC5b3Fb661'
  // );

  // const ticketNftContract = await TicketNftContract.deploy();
  // await ticketNftContract.deployed();
  // await ticketNftContract.mint(4);
  // console.log('Ticket NFT Contract deployed to:', ticketNftContract.address);

  // DEPLOY CHILD CONTRACT
  const MasterrContract = await ethers.getContractFactory('Master', {
    libraries: {
      MasterLibrary: '0x0008977945E80DA2f44Bee8D69670B9E23Af0B85',
    },
  });
  const contractMaster = MasterrContract.attach(
    '0x0Ae4F70eB72D99050f6f245D89F519C806A2738b'
  );

  // await contractMaster.create_collection(
  //   'Child Contract',
  //   _symbol,
  //   _totalClaimable,
  //   _tiers,
  //   _coins,
  //   _amounts,
  //   _coin_to_pay,
  //   _nfts,
  //   _price_to_pay
  // );

  // console.log(await contractMaster.collections(0));

  const childContract = await ethers.getContractFactory('MintingoCollection');
  const childActive = childContract.attach(
    '0x536C2Be7876F2759c769fd8a11c55c7E14408BDE'
  );

  // console.log(await childActive.owner());

  // await childActive.setVariables(1674692834, 3757382848272, 400, '');

  // MINT TICKET NFT
  // console.log(await childActive.owner());

  // APPROVE BUSD

  // const busd = await ethers.getContractFactory('BUSD');
  // const busdContract = busd.attach(
  //   '0xA31A578E30008E6cEfbC219C27694CBfE80119a4'
  // );

  // await busdContract.approve(
  //   '0x536C2Be7876F2759c769fd8a11c55c7E14408BDE',
  //   ethers.constants.MaxInt256
  // );

  // await contractMaster.buy_ticket(
  //   0,
  //   '0xA31A578E30008E6cEfbC219C27694CBfE80119a4',
  //   3
  // );

  await childActive.claim(4);

  // CHECK IF TICKET IS MINTED
  // console.log(
  //   await childActive.balanceOf('0x8F544b12A96C042dF88995ce69136383E160EeD5')
  // );

  console.log('success');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
