const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

const tokenName = 'KloovToken';
const tokenSymbol = 'KLOOV';

describe('Clones', function () {
  before(async function() {
    this.accounts = await ethers.getSigners();
  });

  it('clone a V1 token', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    // const tokenV1Instance = await upgrades.deployProxy(TokenV1, [tokenName, tokenSymbol], { kind: 'uups' });
    const tokenV1Instance = await TokenV1.deploy();
 
    const Factory = await ethers.getContractFactory('FactoryClone');
    const factoryInstance = await Factory.deploy(tokenV1Instance.address);
    await factoryInstance.deployed();
    
    const createTokenTx = await factoryInstance.createToken('TokenV1', 'KLOOV-V1');
    const { events } = await createTokenTx.wait();
    console.log('CDC ~ file: clones-test.js ~ line 23 ~ it ~ events', events);
    const { address: cloneAddress } = events.find(Boolean);
    const clone = new ethers.Contract(cloneAddress, TokenV1.interface, this.accounts[0])
    const cloneVersion = await clone.version();
    expect(cloneVersion).to.equal("V1");
  });
  
});