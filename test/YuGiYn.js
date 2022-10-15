require('chai').should();

const YuGiYn = artifacts.require('YuGiYn');

const BASE_URL = 'http://localhost:3000/metadata/';
const CONTRACT_URI = 'http://localhost:3000/contract-metadata';
const MAX_SUPPLY = 8888;

contract('YuGiYn', accounts => {
  const [
    deployer,
    user01
  ] = accounts;

  let contracts = null;

  const fromDeployer = { from: deployer };
  const fromUser01 = { from: user01 };

  const assertRevert = async (promise) => {
    try {
      await promise();
      return true;
    } catch (error) {
      return false;
    }
  };

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
    it('should be able to mint the specified quantity.', async function() {
      const quantity = 5;
      await contracts.mint(user01, quantity, fromDeployer);

      const balanceOf = await contracts.balanceOf(user01, fromUser01);

      Number(balanceOf).should.be.equal(quantity);
    });

    it('should be transferred to the account specified by the minted token.', async function() {
      const quantity = 1;
      await contracts.mint(user01, quantity, fromDeployer);

      const ownerOf = await contracts.ownerOf(2, fromUser01);
      ownerOf.should.be.equal(user01);
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        const quantity = 1;
        await contracts.mint(user01, quantity, fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        const quantity = 1;
        await contracts.mint(user01, quantity, fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });
  });
});
