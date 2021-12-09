const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", (accounts) => {
    let marketplaceInstance;

    beforeEach("Access deployed contract", async () => {
        // Access deployed contract
        marketplaceInstance = await Marketplace.deployed();
    });

    it("Creates a collection", async () => {

    });
});
