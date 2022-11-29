const { expect, should } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

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
let addr2Address;
let addr2Signer;
let simoneAddress;
let addr4Signer;
let addr4Address;

let childContractAddress;
let childContract;

// Variables for child contract constructor
let _name = 'Child Contract';
let _symbol = 'CHILD';
let _totalClaimable = [300, 100, 200, 300, 400];
let _tiers = [0, 1, 2, 3, 4];
let _coins = [
  '0x0000000000000000000000000000000000000000',
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
];
let _amounts = [0, 10, 10, 10, 10];
let _coin_to_pay = [
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
];
let _nfts = ['0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'];
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
    const MasterLibrary = await ethers.getContractFactory('MasterLibrary');
    const mylabrary = await MasterLibrary.deploy();
    await mylabrary.deployed();

    const masterContractFactory = await ethers.getContractFactory('Master', {
      libraries: {
        MasterLibrary: mylabrary.address,
      },
    });
    const [owner, addr1, addr2, simone, addr4] = await ethers.getSigners();
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
    addr2Address = addr2.address;
    addr2Signer = addr2;
    simoneAddress = simone.address;
    addr4Address = addr4.address;
    addr4Signer = addr4;

    // ✅✅✅✅✅✅✅
    expect(await masterContract.owner()).to.equal(owner.address);
    // ✅✅✅✅✅✅✅
    expect(await busdContract.owner()).to.equal(owner.address);
  });

  // it('Should deploy Mintingo main Contract', async function () {
  //   const mainContractFactory = await ethers.getContractFactory(
  //     'MintingoCollection'
  //   );
  //   mainContract = await mainContractFactory.deploy(
  //     'Main Contract',
  //     _symbol,
  //     _totalClaimable,
  //     _tiers,
  //     _coins,
  //     _amounts,
  //     _coin_to_pay,
  //     _nfts,
  //     _price_to_pay
  //   );
  //   await mainContract.deployed();

  //   // ✅✅✅✅✅✅✅
  //   expect(await mainContract.master()).to.equal(master.toString());
  // });

  // it('Should deploy Interface Contract', async function () {
  //   interfaceContract = await ethers.getContractAt(
  //     'IMintingoCollection',
  //     mainContract.address
  //   );
  // });

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
      _price_to_pay
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
      _price_to_pay
    );

    childContractAddress = await masterContract.collections(0);
    const secondChildContract = await masterContract.collections(1);

    console.log('Master contract: ', masterContract.address);

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
        _price_to_pay
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

  it('Should Transfer 1000 BUSD to addr2', async function () {
    await busdContract.transfer(addr2Address, 1000);

    // ✅✅✅✅✅✅✅
    expect(await busdContract.balanceOf(addr2Address)).to.equal(1000);
  });

  it('Should Transfer 1000 BUSD to addr4', async function () {
    await busdContract.transfer(addr4Address, 1000);

    // ✅✅✅✅✅✅✅
    expect(await busdContract.balanceOf(addr4Address)).to.equal(1000);
  });
});

describe('USDC Contract', function () {
  it('Should return BUSD contract name', async function () {
    // ✅✅✅✅✅✅✅
    expect(await usdcContract.name()).to.equal('USDC Token');
  });

  it('Should Transfer 2000 USDC to addr1', async function () {
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
    expect(await childContract.name()).to.equal(_name);
    // ✅✅✅✅✅✅✅
    expect(await childContract.symbol()).to.equal(_symbol);
    // ✅✅✅✅✅✅✅
    for (let i = 0; i < _coins.length; i++) {
      const value = await childContract.rewards(i);
      if (i == 0) {
        expect(value.coin).to.equal(
          '0x0000000000000000000000000000000000000000'
        );
      } else {
        expect(value.coin).to.equal(_coins[i]);
        expect(value.amount).to.equal(_amounts[i]);
        expect(value.total_claimable).to.equal(_totalClaimable[i]);
        expect(value.total_claimed).to.equal(0);
      }
    }
  });
  // it('Should transfer 1000 BUSD and get BUSD Balance of the main contract', async function () {
  //   await busdContract.transfer(mainContract.address, 1000);
  //   // ✅✅✅✅✅✅;
  //   expect(await busdContract.balanceOf(mainContract.address)).to.equal(1000);
  // });
  // it('Should transfer 1000 USDC and get USDC Balance of the main contract', async function () {
  //   await usdcContract.transfer(mainContract.address, 2000);
  //   // ✅✅✅✅✅✅✅
  //   expect(await usdcContract.balanceOf(mainContract.address)).to.equal(2000);
  // });

  it('Should set variables for the next tests', async function () {
    await childContract.setVariables(
      _start_block,
      _expiration,
      _supply,
      _initNotRevealedUri
    );
  });
});

describe('Referral', function () {
  it('Should set referral parameters', async function () {
    console.log(await busdContract.balanceOf(childContract.address));
    await childContract.set_referral(
      1000,
      100,
      5645645645,
      false,
      [500, 300, 200],
      [1, 1000]
    );
  });
});

describe('Mint Master -> Child', function () {
  it('Should mint 4 NFT to addr1 paying with BUSD: buy_ticket', async function () {
    console.log(
      'nft contract balance:',
      await busdContract.balanceOf(childContractAddress)
    );
    await ticketNftContract.connect(addr1Signer).mint(2);
    // approve the contract to spend BUSD

    await busdContract
      .connect(addr1Signer)
      .approve(childContract.address, ethers.constants.MaxInt256);

    await masterContract
      .connect(addr1Signer)
      .buy_ticket('0', busdContract.address, '4', ownerAddress);

    console.log(await busdContract.balanceOf(ownerAddress));
    console.log(await busdContract.balanceOf(addr1Address));
    console.log(await busdContract.balanceOf(addr2Address));
    console.log(await busdContract.balanceOf(addr4Address));
    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr1Address)).to.equal(4);
    expect(await childContract.totalSupply()).to.equal(4);
    expect(await busdContract.balanceOf(childContract.address)).to.equal(103);
    expect(await busdContract.balanceOf(addr1Address)).to.equal(880);
  });

  // it('Should mint 2 NFT to addr1 paying with USDC: buy_ticket', async function () {
  //   await usdcContract
  //     .connect(addr1Signer)
  //     .approve(childContract.address, ethers.constants.MaxInt256);

  //   await masterContract
  //     .connect(addr1Signer)
  //     .buy_ticket(0, usdcContract.address, 2, ownerAddress);

  //   // ✅✅✅✅✅✅✅
  //   expect(await childContract.balanceOf(addr1Address)).to.equal(6);
  //   expect(await childContract.totalSupply()).to.equal(6);
  //   expect(await usdcContract.balanceOf(childContract.address)).to.equal(69);
  //   expect(await usdcContract.balanceOf(addr1Address)).to.equal(1920);
  // });

  it('Should mint 4 NFT to addr2 paying with BUSD: buy_ticket', async function () {
    await ticketNftContract.connect(addr2Signer).mint(2);
    // approve the contract to spend BUSD

    await busdContract
      .connect(addr2Signer)
      .approve(childContract.address, ethers.constants.MaxInt256);

    await masterContract
      .connect(addr2Signer)
      .buy_ticket('0', busdContract.address, '4', addr1Address);

    console.log(await busdContract.balanceOf(ownerAddress));
    console.log(await busdContract.balanceOf(addr1Address));
    console.log(await busdContract.balanceOf(addr2Address));
    console.log(await busdContract.balanceOf(addr4Address));
    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr2Address)).to.equal(4);
    expect(await childContract.totalSupply()).to.equal(8);
    expect(await busdContract.balanceOf(childContract.address)).to.equal(203);
    expect(await busdContract.balanceOf(addr2Address)).to.equal(880);
  });

  it('Should mint 4 NFT to addr4 paying with BUSD: buy_ticket', async function () {
    await ticketNftContract.connect(addr4Signer).mint(2);
    // approve the contract to spend BUSD

    await busdContract
      .connect(addr4Signer)
      .approve(childContract.address, ethers.constants.MaxInt256);

    await masterContract
      .connect(addr4Signer)
      .buy_ticket('0', busdContract.address, '4', addr2Address);

    console.log(await busdContract.balanceOf(ownerAddress));
    console.log(await busdContract.balanceOf(addr1Address));
    console.log(await busdContract.balanceOf(addr2Address));
    console.log(await busdContract.balanceOf(addr4Address));
    console.log(
      'nft contract balance:',
      await busdContract.balanceOf(childContractAddress)
    );
    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr2Address)).to.equal(4);
    expect(await childContract.totalSupply()).to.equal(12);
    expect(await busdContract.balanceOf(childContract.address)).to.equal(301);
    expect(await busdContract.balanceOf(addr2Address)).to.equal(885);
  });

  it('Should reveal the NFTs: reveal', async function () {
    await masterContract.reveal_by_id(
      childContract.address,
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      'ciao'
    );

    const rewards = await childContract.reward_by_token(0);
    const rewards1 = await childContract.reward_by_token(1);
    const rewards2 = await childContract.reward_by_token(2);
    const rewards3 = await childContract.reward_by_token(3);

    // ✅✅✅✅✅✅✅
    expect(await childContract.revealed()).to.equal(true);
  });

  it('Should claim the rewards: claim', async function () {
    await childContract
      .connect(addr1Signer)
      .setApprovalForAll(childContract.address, true);
    await childContract.connect(addr1Signer).claim(2);

    // ✅✅✅✅✅✅✅
    expect(await childContract.balanceOf(addr1Address)).to.equal(3);
    expect(await busdContract.balanceOf(addr1Address)).to.equal(898);
    expect(await busdContract.balanceOf(childContract.address)).to.equal(291);
  });
});
