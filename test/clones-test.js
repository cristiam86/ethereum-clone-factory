const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokenName = 'KloovToken';
const tokenSymbol = 'KLOOV';
const NEW_STORE_A = 1234;
const NEW_STORE_B = 4321;

describe('Clones', function () {
  before(async function() {
    this.accounts = await ethers.getSigners();
  });

  it('create a V1 token', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const tokenV1Instance = await TokenV1.deploy();
 
    const Factory = await ethers.getContractFactory('TokenFactory');
    const factoryInstance = await Factory.deploy(tokenV1Instance.address);
    await factoryInstance.deployed();
    
    const createTokenTx = await factoryInstance.createToken(tokenName, tokenSymbol);
    const { events } = await createTokenTx.wait();
    const { args: { cloneAddress } } = events.find((({ event }) => event === 'TokenCreated'));
    const clone = new ethers.Contract(cloneAddress, TokenV1.interface, this.accounts[0])
    const cloneVersion = await clone.version();
    expect(cloneVersion).to.equal("V1");
    
    const cloneName = await clone.name();
    expect(cloneName).to.equal(tokenName);
    const cloneSymbol = await clone.symbol();
    expect(cloneSymbol).to.equal(tokenSymbol);
  });
  
  it('create a V1 token and upgrade it to V2', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const TokenV2 = await ethers.getContractFactory('TokenV2');
    const tokenV1Instance = await TokenV1.deploy();
    const tokenV2Instance = await TokenV2.deploy();
 
    const Factory = await ethers.getContractFactory('TokenFactory');
    const factoryInstance = await Factory.deploy(tokenV1Instance.address);
    await factoryInstance.deployed();
    
    const createTokenTx = await factoryInstance.createToken(tokenName, tokenSymbol);
    const { events } = await createTokenTx.wait();
    const { args: { cloneAddress } } = events.find((({ event }) => event === 'TokenCreated'));
    const clone = new ethers.Contract(cloneAddress, TokenV1.interface, this.accounts[0])
    const cloneVersion = await clone.version();
    expect(cloneVersion).to.equal("V1");

    factoryInstance.upgradeImplementation(tokenV2Instance.address);

    const cloneNewVersion = await clone.version();
    expect(cloneNewVersion).to.equal("V2");
    
    const cloneName = await clone.name();
    expect(cloneName).to.equal(tokenName);
    const cloneSymbol = await clone.symbol();
    expect(cloneSymbol).to.equal(tokenSymbol);
  });
  
  it('preserves the state when upgrading V1 to V2', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const TokenV2 = await ethers.getContractFactory('TokenV2');
    const tokenV1Instance = await TokenV1.deploy();
    const tokenV2Instance = await TokenV2.deploy();
 
    const Factory = await ethers.getContractFactory('TokenFactory');
    const factoryInstance = await Factory.deploy(tokenV1Instance.address);
    await factoryInstance.deployed();
    
    const createTokenTx = await factoryInstance.createToken(tokenName, tokenSymbol);
    const { events } = await createTokenTx.wait();
    const { args: { cloneAddress } } = events.find((({ event }) => event === 'TokenCreated'));
    const clone = new ethers.Contract(cloneAddress, TokenV1.interface, this.accounts[0])
    clone.setStore(NEW_STORE_A);

    factoryInstance.upgradeImplementation(tokenV2Instance.address);

    const v2Store = await clone.store();
    expect(v2Store).to.equal(NEW_STORE_A);
  });
  
  it('each clone preserves the state when upgrading V1 to V2', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const TokenV2 = await ethers.getContractFactory('TokenV2');
    const tokenV1Instance = await TokenV1.deploy();
    const tokenV2Instance = await TokenV2.deploy();
 
    const Factory = await ethers.getContractFactory('TokenFactory');
    const factoryInstance = await Factory.deploy(tokenV1Instance.address);
    await factoryInstance.deployed();
    
    const createTokenTx_A = await factoryInstance.createToken(tokenName, tokenSymbol);
    const { events: events_A } = await createTokenTx_A.wait();
    const { args: { cloneAddress: clone_A_Address } } = events_A.find((({ event }) => event === 'TokenCreated'));    
    const clone_A = new ethers.Contract(clone_A_Address, TokenV1.interface, this.accounts[0])
    clone_A.setStore(NEW_STORE_A);
    
    const createTokenTx_B = await factoryInstance.createToken(tokenName, tokenSymbol);
    const { events: events_B } = await createTokenTx_B.wait();
    const { args: { cloneAddress: clone_B_Address } } = events_B.find((({ event }) => event === 'TokenCreated'));
    const clone_B = new ethers.Contract(clone_B_Address, TokenV1.interface, this.accounts[0])
    clone_B.setStore(NEW_STORE_B);

    factoryInstance.upgradeImplementation(tokenV2Instance.address);

    const v2Store_A = await clone_A.store();
    expect(v2Store_A).to.equal(NEW_STORE_A);
    
    const v2Store_B = await clone_B.store();
    expect(v2Store_B).to.equal(NEW_STORE_B);
  });
  
});