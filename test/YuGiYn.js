require('chai').should();

const YuGiYn = artifacts.require('YuGiYn');

const BASE_URL = 'http://localhost:3000/metadata/';
const CONTRACT_URI = 'http://localhost:3000/contract-metadata';
const MAX_SUPPLY = 8888;

contract('YuGiYn', accounts => {
  const [
    deployer,
    user01,
    user02,
    user03
  ] = accounts;

  let contracts = null;

  const fromDeployer = { from: deployer };
  const fromUser01 = { from: user01 };
  const fromUser02 = { from: user02 };
  const fromUser03 = { from: user03 };

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

    it('Fails if quantity specified exceeds total suppliy.', async function() {
      try {
        const quantity = 8888;
        await contracts.mint(user01, quantity, fromDeployer);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Over max supply');
      }
    });
  });

  describe('giveoutMint', function() {
    it('should be able to mint the specified quantity.', async function() {
      const addresses = [
        user01,
        user02,
        user03
      ];
      const quantity = 2;
      await contracts.giveoutMint(addresses, quantity, fromDeployer);

      const balanceOfUser01 = await contracts.balanceOf(user01, fromUser01);
      const balanceOfUser02 = await contracts.balanceOf(user02, fromUser01);
      const balanceOfUser03 = await contracts.balanceOf(user03, fromUser01);

      Number(balanceOfUser01).should.be.equal(quantity);
      Number(balanceOfUser02).should.be.equal(quantity);
      Number(balanceOfUser03).should.be.equal(quantity);
    });

    it('should be transferred to the account specified by the minted token.', async function() {
      const addresses = [
        user01,
        user02,
        user03
      ];
      const quantity = 1;
      await contracts.giveoutMint(addresses, quantity, fromDeployer);

      let ownerOf;
      ownerOf = await contracts.ownerOf(2, fromUser01);
      ownerOf.should.be.equal(user01);
      ownerOf = await contracts.ownerOf(3, fromUser02);
      ownerOf.should.be.equal(user02);
      ownerOf = await contracts.ownerOf(4, fromUser03);
      ownerOf.should.be.equal(user03);
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        const addresses = [
          user01,
          user02,
          user03
        ];
        const quantity = 1;
        await contracts.giveoutMint(addresses, quantity, fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });

    it('Fails if quantity specified exceeds total suppliy.', async function() {
      try {
        const addresses = [
          user01,
          user02,
          user03
        ];
        const quantity = 8888;

        await contracts.giveoutMint(addresses, quantity, fromDeployer);
      } catch(error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Over max supply');
      }
    });
  });

  describe('stageNumber', function() {
    it('should return the quantity of the sales stage.', async function() {
      const stageNumber = await contracts.stageNumber();
      Number(stageNumber).should.be.equal(3);
    });
  });

  describe('totalStages', function() {
    it('should return the quantity of the sales stage.', async function() {
      const totalStages = await contracts.totalStages();
      Number(totalStages).should.be.equal(4);
    });
  });

  describe('claimed', function() {
    it('claimed.', async function() {
      //
    });
  });

  describe('allowance', function() {
    it('allowance.', async function() {
      //
    });
  });

  describe('saleStageMint', function() {
    it('saleStageMint.', async function() {
      //
    });
  });

  describe('setBaseURI', function() {
    it('should be possible to change the baseURI.', async function() {
      const uri = 'https://localhost:8000';
      await contracts.setBaseURI(uri, fromDeployer);

      const baseUri = await contracts.baseURI();
      baseUri.should.be.equal(uri);
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        const uri = 'https://localhost:8000';
      await contracts.setBaseURI(uri, fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });
  });

  describe('setContractURI', function() {
    it('should be possible to change the contractURI.', async function() {
      const uri = 'https://localhost:8000';
      await contracts.setContractURI(uri);

      const contractURI = await contracts.contractURI();
      contractURI.should.be.equal(uri);
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        const uri = 'https://localhost:8000';
        await contracts.setContractURI(uri, fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });
  });

  describe('clearSaleStages', function() {
    it('should be able to clear the sales stage.', async function() {
      let totalStages;

      totalStages = await contracts.totalStages();
      Number(totalStages).should.be.equal(4);

      await contracts.clearSaleStages(fromDeployer);

      totalStages = await contracts.totalStages();
      Number(totalStages).should.be.equal(0);
    });

    it('Fails if executed by anyone other than the owner.', async function() {
      try {
        await contracts.clearSaleStages(fromUser01);
      } catch (error) {
        error.message.should.be.equal('Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner');
      }
    });
  });

  describe('setSaleStages', function() {
    it('setSaleStages.', async function() {
      await contracts.clearSaleStages(fromDeployer);

      const startTimeVals = [
        1656601200,
        1657119600,
        1659279600,
        1661958000,
      ];
      const priceWeiVals = [];
      const maxPerAddressVals = [];
      const mintableVals = [];
      const useListVals = [];

      await contracts.setSaleStages(
        startTimeVals,
        priceWeiVals,
        maxPerAddressVals,
        mintableVals,
        useListVals,
        fromDeployer
      );
    });
  });

  describe('setAllowList', function() {
    it('setAllowList.', async function() {
      //
    });
  });

  describe('setClaimed', function() {
    it('setClaimed.', async function() {
      //
    });
  });

  describe('setTreasury', function() {
    it('setTreasury.', async function() {
      //
    });
  });

  describe('pause', function() {
    it('pause.', async function() {
      //
    });
  });

  describe('unpause', function() {
    it('unpause.', async function() {
      //
    });
  });

  describe('withdraw', function() {
    it('withdraw.', async function() {
      //
    });
  });

  describe('onlyEOA', function() {
    it('onlyEOA.', async function() {
      //
    });
  });

  describe('supportsInterface', function() {
    it('supportsInterface.', async function() {
      //
    });
  });
});
