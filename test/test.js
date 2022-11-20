const { expect, should } = require('chai');
const { BigNumber } = require('ethers');
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
let _totalClaimable = [100, 200, 300, 400];
let _tiers = [1, 2, 3, 4];
let _coins = [
  '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
];
let _amounts = [1000, 2000, 3000, 4000];
let _coin_to_pay = [
  '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
];
let _nfts = ['0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'];
let _price_to_pay = [30, 40];
let master;

// Variables for child contract functions //

let _start_block = 100;
let _expiration = 30;
let _supply = 1000;
let _initNotRevealedUri = '';

// ---- TESTS ---- //

describe('Master Contract', function () {
  // ---- Before Each ---- //

  beforeEach(async function () {
    // Deploy Master Contract
    const masterContractFactory = await ethers.getContractFactory('Master');
    const [owner, addr1, addr2] = await ethers.getSigners();
    masterContract = await masterContractFactory.deploy();
    // Deploy BUSD Contract
    const BEP20TokenFactory = await ethers.getContractFactory('BUSD');
    busdContract = await BEP20TokenFactory.deploy();
    await busdContract.deployed();

    // Deploy USDC Contract
    const BEP20TokenFactory2 = await ethers.getContractFactory('USDC');
    usdcContract = await BEP20TokenFactory2.deploy();
    await usdcContract.deployed();

    // Deploy TICKET NFT contract
    const ticketNftFactory = await ethers.getContractFactory('TicketNft');
    ticketNftContract = await ticketNftFactory.deploy();
    await ticketNftContract.deployed();

    // Assign addresses
    ownerSigner = owner;
    master = masterContract.address;
    ownerAddress = owner.address;
    addr1Address = addr1.address;
    addr1Signer = addr1;

    // ✅✅✅✅✅✅✅
    expect(await masterContract.owner()).to.equal(owner.address);
    // ✅✅✅✅✅✅✅
    expect(await busdContract.owner()).to.equal(owner.address);
  });

  it('Should deploy Mintingo main Contract', async function () {
    const mainContractFactory = await ethers.getContractFactory(
      'MintingoCollection'
    );
    mainContract = await mainContractFactory.deploy(
      'Main Contract',
      _symbol,
      _totalClaimable,
      _tiers,
      _coins,
      _amounts,
      _coin_to_pay,
      _nfts,
      _price_to_pay,
      master.toString()
    );
    await mainContract.deployed();

    // ✅✅✅✅✅✅✅
    expect(await mainContract.master()).to.equal(master.toString());
  });

  it('Should deploy Interface Contract', async function () {
    interfaceContract = await ethers.getContractAt(
      'IMintingoCollection',
      mainContract.address
    );
  });

  it('Create a child collection', async function () {
    await masterContract.create_collection(
      _name,
      _symbol,
      _totalClaimable,
      _tiers,
      _coins,
      _amounts,
      _coin_to_pay,
      _nfts,
      _price_to_pay,
      master.toString()
    );

    await masterContract.create_collection(
      _name,
      _symbol,
      _totalClaimable,
      _tiers,
      _coins,
      _amounts,
      _coin_to_pay,
      _nfts,
      _price_to_pay,
      master.toString()
    );

    childContractAddress = await masterContract.collections(0);
    const secondChildContract = await masterContract.collections(1);

    console.log('Master contract: ', masterContract.address);
    console.log('Mintingo contract: ', mainContract.address);
    console.log('Owner contract: ', ownerAddress);
    console.log('ChildContract contract: ', childContractAddress);
    console.log('BUSD contract: ', busdContract.address);
    console.log('USDC contract: ', usdcContract.address);
    console.log('TicketNFT contract: ', ticketNftContract.address);

    // ✅✅✅✅✅✅✅
    expect(await masterContract.collections(0)).to.equal(
      childContractAddress.toString()
    );
    // ✅✅✅✅✅✅✅
    expect(await masterContract.collections_ids(0)).to.equal(
      childContractAddress.toString()
    );
    // ✅✅✅✅✅✅✅
    expect(await masterContract.collections_ids(1)).to.equal(
      secondChildContract.toString()
    );

    // ❌❌❌❌❌❌❌
    await expect(
      masterContract.create_collection(
        _name,
        _symbol,
        _totalClaimable,
        [1],
        _coins,
        _amounts,
        _coin_to_pay,
        _nfts,
        _price_to_pay,
        master.toString()
      )
    ).to.be.revertedWith('INVALID_DATA');
  });
});

describe('BUSD Contract', function () {
  it('Should return BUSD contract name', async function () {
    // ✅✅✅✅✅✅✅
    expect(await busdContract.name()).to.equal('BUSD Token');
  });

  it('Should Transfer 1000 BUSD to addr1', async function () {
    await busdContract.transfer(addr1Address, 1000);

    // ✅✅✅✅✅✅✅
    expect(await busdContract.balanceOf(addr1Address)).to.equal(1000);
  });
});

describe('USDC Contract', function () {
  it('Should return BUSD contract name', async function () {
    // ✅✅✅✅✅✅✅
    expect(await usdcContract.name()).to.equal('USDC Token');
  });

  it('Should Transfer 2000 BUSD to addr1', async function () {
    await usdcContract.transfer(addr1Address, 2000);

    // ✅✅✅✅✅✅✅
    expect(await usdcContract.balanceOf(addr1Address)).to.equal(2000);
  });
});

describe('Main Contract', function () {
  // ---- Properties ---- //

  // ---- Tests ---- //

  it('Should check all parameters passed to constructor', async function () {
    // Get contract instance from address
    childContract = await ethers.getContractAt(
      'MintingoCollection',
      childContractAddress
    );

    // ✅✅✅✅✅✅✅
    expect(await childContract.master()).to.equal(master.toString());
    // ✅✅✅✅✅✅✅
    expect(await childContract.name()).to.equal(_name);
    // ✅✅✅✅✅✅✅
    expect(await childContract.symbol()).to.equal(_symbol);
    // ✅✅✅✅✅✅✅
    for (let i = 0; i < _coins.length + 1; i++) {
      const value = await childContract.rewards(i);
      if (i == 0) {
        expect(value.coin).to.equal(
          '0x0000000000000000000000000000000000000000'
        );
      } else {
        expect(value.coin).to.equal(_coins[i - 1]);
        expect(value.amount).to.equal(_amounts[i - 1]);
        expect(value.total_claimable).to.equal(_totalClaimable[i - 1]);
        expect(value.total_claimed).to.equal(0);
      }
    }
  });

  it('Should transfer 1000 BUSD and get BUSD Balance of the main contract', async function () {
    await busdContract.transfer(mainContract.address, 1000);

    // ✅✅✅✅✅✅;
    expect(await busdContract.balanceOf(mainContract.address)).to.equal(1000);
  });

  it('Should transfer 1000 USDC and get USDC Balance of the main contract', async function () {
    await usdcContract.transfer(mainContract.address, 2000);

    // ✅✅✅✅✅✅✅
    expect(await usdcContract.balanceOf(mainContract.address)).to.equal(2000);
  });

  it('Should set variables for the next tests', async function () {
    await masterContract.set_variables(
      0,
      _start_block,
      _expiration,
      _supply,
      _initNotRevealedUri
    );
  });
});

describe('Mint Master -> Child', function () {
  it('Should mint 4 NFT to addr1 paying with BUSD: buy_ticket', async function () {
    // const ticket = await childContract.getTicket();
    // console.log(ticket[2][0]);

    await ticketNftContract.connect(addr1Signer).mint(2);
    // approve the contract to spend BUSD
    await busdContract
      .connect(addr1Signer)
      .approve(childContract.address, ethers.constants.MaxInt256);

    await masterContract
      .connect(addr1Signer)
      .buy_ticket(0, busdContract.address, 4);

    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr1Address)).to.equal(4);
    expect(await childContract.totalSupply()).to.equal(4);
    expect(await busdContract.balanceOf(childContract.address)).to.equal(120);
  });

  it('Should mint 2 NFT to addr1 paying with USDC: buy_ticket', async function () {
    await usdcContract
      .connect(addr1Signer)
      .approve(childContract.address, ethers.constants.MaxInt256);

    await masterContract
      .connect(addr1Signer)
      .buy_ticket(0, usdcContract.address, 2);

    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr1Address)).to.equal(6);
    expect(await childContract.totalSupply()).to.equal(6);
    expect(await usdcContract.balanceOf(childContract.address)).to.equal(80);
  });
});
