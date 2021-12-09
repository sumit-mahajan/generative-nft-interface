const Application = artifacts.require("./Application.sol");

contract("Application", (accounts) => {
    let applicationInstance;
    let address;

    beforeEach("Access deployed contract", async () => {
        // Access deployed contract
        applicationInstance = await Application.deployed();
    });

    it("Creates an poll", async () => {
        try {
            // Create poll from accounts[1]
            const transaction = await applicationInstance.createPoll("Voting 201", "This is voting 201", ["A", "B", "C"], { from: accounts[1] });

            // Access logs from transaction
            const { logs } = transaction;
            assert.ok(Array.isArray(logs), "logs is not an array");
            assert.equal(logs.length, 1, "Multiple events are emitted");

            // Access events from logs
            const log = logs[0];
            assert.equal(log.event, "PollCreated", "Incorrect event was emitted");
            assert.notEqual(log.args.pollAddress, null, "Contract address wasn't emitted");
            assert.equal(log.args.ownerAddress, accounts[1], "Owner address doesn't match");

            // Store poll address
            address = log.args.pollAddress;

        } catch (err) {
            assert.isTrue(false, err.toString())
        }
    });

    it("Gets poll overview", async () => {
        // Create poll with empty title or description
        const poll = await applicationInstance.getPollOverview.call(0, accounts[1]);

        assert.equal(poll.pollAddress, address, "Wrong contract address")
        assert.equal(poll.title, "Voting 201", "Wrong contract title")
        assert.equal(poll.description, "This is voting 201", "Wrong contract description")
        assert.equal(poll._owner, accounts[1], "Wrong contract owner")
        assert.equal(poll.nOptions, 3, "Wrong number of options")
        assert.equal(poll.isResultAnnounced, false, "Contract result shows announced")
        assert.equal(poll.totalVotes.toNumber(), 0, "Wrong total votes")
        assert.equal(poll.hasUserVoted, false, "Shows user has voted")
    });

    it("Can't create poll with empty title", async () => {
        try {
            // Create poll with empty title or description
            await applicationInstance.createPoll("", "Hii", ["A", "B", "C"], { from: accounts[1] });
            assert.isTrue(false, "Poll contract gets deployed successfully")
        } catch (err) {
            assert.include(err.toString(), "Title can't be empty")
        }
    });

    it("Can't create poll with empty description", async () => {
        try {
            // Create poll with empty title or description
            await applicationInstance.createPoll("Hii", "", ["A", "B", "C"], { from: accounts[1] });
            assert.isTrue(false, "Poll contract gets deployed successfully")
        } catch (err) {
            assert.include(err.toString(), "Description can't be empty")
        }
    });

    it("Can't create poll with empty options", async () => {
        try {
            // Create poll with empty title or description
            await applicationInstance.createPoll("Voting 301", "This is voting 301", ["", "B", ""], { from: accounts[1] });
            assert.isTrue(false, "Poll contract gets deployed successfully")
        } catch (err) {
            assert.include(err.toString(), "Options can't be empty")
        }
    });
});
