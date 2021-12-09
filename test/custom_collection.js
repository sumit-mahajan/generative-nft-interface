const { assert } = require("chai");

const Marketplace = artifacts.require("./Marketplace.sol");
const CustomCollection = artifacts.require("./CustomCollection.sol");

contract("CustomCollection", (accounts) => {
    let marketplaceInstance;
    let collectionInstance;

    beforeEach("Access deployed contract", async () => {
        // marketplaceInstance = await Marketplace.deployed();

        // await marketplaceInstance.createCollection("", { from: accounts[0] });

        // const cAddress = await marketplaceInstance.collections.call(0);

        // collectionInstance = await CustomCollection.at(cAddress);
    });

    it("Stores creator", async () => {

    });


});
