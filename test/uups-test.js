const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

const tokenName = 'KloovToken';
const tokenSymbol = 'KLOOV';

describe('Upgrades', function () {
  it('deploys V1', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const tokenV1Instance = await upgrades.deployProxy(TokenV1, [tokenName, tokenSymbol], { kind: 'uups' });
    const v1Version = await tokenV1Instance.version();
    expect(v1Version).to.equal("V1");
  });
  
  it('initializes V1 name and symbol', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const tokenV1Instance = await upgrades.deployProxy(TokenV1, [tokenName, tokenSymbol], { kind: 'uups' });
    const v1Name = await tokenV1Instance.name();
    expect(v1Name).to.equal(tokenName);
    
    const v1Symbol = await tokenV1Instance.symbol();
    expect(v1Symbol).to.equal(tokenSymbol);
  });

  it('upgrades to V2', async function() {
    const TokenV1 = await ethers.getContractFactory('TokenV1');
    const TokenV2 = await ethers.getContractFactory('TokenV2');
    const tokenV1Instance = await upgrades.deployProxy(TokenV1, [tokenName, tokenSymbol], { kind: 'uups' });
    const tokenV2Instance = await upgrades.upgradeProxy(tokenV1Instance.address, TokenV2);

    const v2Version = await tokenV2Instance.version();
    expect(v2Version).to.equal("V2");
  })
});