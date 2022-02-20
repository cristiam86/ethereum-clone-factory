const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokenName = 'KloovToken';
const tokenSymbol = 'KLOOV';

describe('single implementation tests', function () {
  before(async function() {
    this.TokenV1 = await ethers.getContractFactory('TokenV1');
    this.TokenV2 = await ethers.getContractFactory('TokenV2');
  });

  beforeEach(async function() {
    this.tokenV1Instance = await this.TokenV1.deploy();
    this.tokenV2Instance = await this.TokenV2.deploy();;
  })
  it('deploys V1', async function() {
    const v1Version = await this.tokenV1Instance.version();
    expect(v1Version).to.equal("V1");
  });
  
  it('initializes V1 name, symbol, and store', async function() {
    await this.tokenV1Instance.initialize(tokenName, tokenSymbol);

    const v1Name = await this.tokenV1Instance.name();
    expect(v1Name).to.equal(tokenName);
    
    const v1Symbol = await this.tokenV1Instance.symbol();
    expect(v1Symbol).to.equal(tokenSymbol);

    const v1Store = await this.tokenV1Instance.store();
    expect(v1Store).to.equal(0);
  });
  
  it('v1 updates the store properly', async function() {
    const newStore = 8;
    await this.tokenV1Instance.setStore(newStore);
    const v1Store = await this.tokenV1Instance.store();
    expect(v1Store).to.equal(newStore)
  });

  it('deploys V2', async function() {
    const v2Version = await this.tokenV2Instance.version();
    expect(v2Version).to.equal("V2");
  })

  it('initializes V2 store', async function() {
    const v2Store = await this.tokenV2Instance.store();
    expect(v2Store).to.equal(0);
  });

  it('v2 updates the store properly', async function() {
    const newStore = 18;
    await this.tokenV2Instance.setStore(newStore);
    const v1Store = await this.tokenV2Instance.store();
    expect(v1Store).to.equal(newStore)
  });
});