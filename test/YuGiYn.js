require('chai').should();

const YuGiYn = artifacts.require('YuGiYn');

const BASE_URL = 'http://localhost:3000/metadata/';
const CONTRACT_URI = 'http://localhost:3000/contract-metadata';
const MAX_SUPPLY = 8888;

contract('YuGiYn', accounts => {
  const [
    deployer
  ] = accounts;

  let contracts = null;

  const fromDeployer = { from: deployer };

  beforeEach(async function() {
    contracts = await YuGiYn.new(fromDeployer);
  });

  describe('baseURI', function() {
    it('has a baseURI.', async function() {
      const baseUri = await contracts.baseURI();
      baseUri.should.be.equal(BASE_URL);
    });
  });

  describe('MAX_SUPPLY', function() {
    it('has a MAX_SUPPLY.', async function() {
      const maxSupply = await contracts.MAX_SUPPLY();
      Number(maxSupply).should.be.equal(MAX_SUPPLY);
    });
  });

  describe('exists', function() {
    it('should return true if the token id exists.', async function() {
      const exists = await contracts.exists(1);
      exists.should.be.true;
    });

    it('should return false if the token id does not exist.', async function() {
      const exists = await contracts.exists(999999);
      exists.should.be.false;
    });
  });

  describe('contractURI', function() {
    it('has a contractURI.', async function() {
      const contractURI = await contracts.contractURI();
      contractURI.should.be.equal(CONTRACT_URI);
    });
  });

  describe('mint', function() {
    it('mint', async function() {
      await contracts.mint();
    });
  });
});
