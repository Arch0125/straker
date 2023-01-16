
const { expect } = require("chai")
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers } = require("hardhat")
const {
    deployTestFramework
} = require("@superfluid-finance/ethereum-contracts/dev-scripts/deploy-test-framework")
const TestToken = require("@superfluid-finance/ethereum-contracts/build/contracts/TestToken.json")

// Instances
let sf;                          // Superfluid framework API object
let spreader: { address: any; connect: (arg0: { address: any }) => { (): any; new(): any; gainShare: { (arg0: any): any; new(): any }; distribute: { (): any; new(): any } } };                    // spreader contract object
let dai;                         // underlying token of daix
let daix: {
  underlyingToken: { address: any }; address: any; upgrade: (arg0: { amount: any }) => any; approveSubscription: (arg0: { indexId: string; publisher: any }) => any; getSubscription: (arg0: {
    publisher: any; indexId: string // recall this was `INDEX_ID` in TokenSpreader.sol
    subscriber: any; providerOrSigner: { address: any }
  }) => any
};                        // will act as `spreaderToken` - is a super token wrapper of dai

// Test Accounts
let admin;
let alice: { address: any };
let bob;

// Constants
let expecationDiffLimit = 10;    // sometimes the IDA distributes a little less wei than expected. Accounting for potential discrepency with 10 wei margin

const errorHandler = (err:any) => {
  if (err) throw err;
}

before(async function () {

  // get hardhat accounts
  [admin, alice, bob] = await ethers.getSigners();

  const sfDeployer = await deployTestFramework();

  // GETTING SUPERFLUID FRAMEWORK SET UP

  // deploy the framework locally
  const contractsFramework = await sfDeployer.getFramework();

  // initialize framework
  sf = await Framework.create({
      chainId: 31337,
      provider: admin.provider,
      resolverAddress: contractsFramework.resolver, // needed as placeholder
      protocolReleaseVersion: "test"
  });

  await sfDeployer.deployWrapperSuperToken(
    "Fake DAI Token",
    "fDAI",
    18,
    ethers.utils.parseEther("100000000").toString()
  );

  // create a fake erc20 wrapper super token around the DAI token
  daix = await sf.loadSuperToken("fDAIx");

  // get the ethers contract object for the fake erc20 test token
  dai = new ethers.Contract(daix.underlyingToken.address, TestToken.abi, admin);

    // minting test DAI
    await dai.connect(admin).mint(admin.address, thousandEther);
    await dai.connect(alice).mint(alice.address, thousandEther);
    await dai.connect(bob).mint(bob.address, thousandEther);

    // approving DAIx to spend DAI
    await dai.connect(admin).approve(daix.address, ethers.constants.MaxInt256);
    await dai.connect(alice).approve(daix.address, ethers.constants.MaxInt256);
    await dai.connect(bob).approve(daix.address, ethers.constants.MaxInt256);

    // Upgrading all DAI to DAIx
    const wrapOperation = daix.upgrade({amount: thousandEther});
    await wrapOperation.exec(admin);
    await wrapOperation.exec(alice);
    await wrapOperation.exec(bob);

    const spreaderContractFactory = await ethers.getContractFactory(
      "TokenSpreader",
      admin
    );

    spreader = await spreaderContractFactory.deploy(
        daix.address // Setting DAIx as spreader token
    );

    const approveSubscriptionOperation = await daix.approveSubscription({
      indexId: "0",
      publisher: spreader.address
    });

    await approveSubscriptionOperation.exec(alice);
    await approveSubscriptionOperation.exec(bob);

});




describe("TokenSpreader Test Sequence", async () => {
  it("Distribution with [ 1 unit issued ] but [ 0 spreaderTokens held ] - gainShare", async function () {
    // ACTIONS

    // Alice claims distribution unit
    await spreader.connect(alice).gainShare(alice.address)

    // EXPECTATIONS

    // expect alice to have 1 distribution unit
    let aliceSubscription = await daix.getSubscription({
        publisher: spreader.address,
        indexId: "0", // recall this was `INDEX_ID` in TokenSpreader.sol
        subscriber: alice.address,
        providerOrSigner: alice
    })

    await expect(aliceSubscription.units).to.equal("1")

    // distribution SHOULD NOT REVERT if there are outstanding units issued
    await expect(spreader.connect(alice).distribute()).to.be.not.reverted
})

})