const { assert } = require("chai");

const Application = artifacts.require("./Application.sol");
const Poll = artifacts.require("./Poll.sol");

contract("Poll", (accounts) => {
    let pollInstance;

    beforeEach("Access deployed contract", async () => {
        // Access deployed Application contract
        applicationInstance = await Application.deployed();
        // Deploy Poll contract
        await applicationInstance.createPoll('Voting 101', 'This is voting 101', ['sumit', 'hrushi', 'pratik'], { from: accounts[0] });
        // Get address of poll contract deployed
        const pollAddress = await applicationInstance.polls.call(0);
        // Access Poll contract instance at pollAddress
        pollInstance = await Poll.at(pollAddress);
    });

    it("Stores owner, title and description", async () => {
        const owner = await pollInstance.owner.call();
        const storedTitle = await pollInstance.title.call();
        const storedDescription = await pollInstance.description.call();
        const nOptions = await pollInstance.nOptions.call();
        const firstOption = await pollInstance.getOption.call(0);

        // Check if stored data matches passed data
        assert.equal(owner, accounts[0], "Owner does not match");
        assert.equal(storedTitle, "Voting 101", "Title does not match");
        assert.equal(
            storedDescription,
            "This is voting 101",
            "Description does not match"
        );
        assert.equal(nOptions, 3, "No of options does not tally");
        assert.equal(firstOption, "sumit", "First option does not match");
    });

    it("Can vote", async () => {
        const prevState = await pollInstance.voters.call(accounts[1]);

        // Vote for index 0 from account 1
        await pollInstance.vote(0, { from: accounts[1] });
        const afterState = await pollInstance.voters.call(accounts[1]);

        // Check if voters mapping is updated
        assert.equal(prevState, false, "Prev state wrong");
        assert.equal(afterState, true, "After state wrong");
    });

    it("Same address can't vote twice", async () => {
        try {
            // Vote again from account 1
            await pollInstance.vote(1, { from: accounts[1] });
        } catch (err) {
            assert.include(err.toString(), "You have already voted");
        }
    });

    it("Only owner can announce result", async () => {
        try {
            // Try announcing results from non-owner account
            await pollInstance.announceResult({ from: accounts[1] });
        } catch (err) {
            assert.include(err.toString(), "Only owner can announce result");
        }
    });

    it("Can't get winner before it is announced", async () => {
        try {
            // Try announcing results from non-owner account
            await pollInstance.getWinner.call();
        } catch (err) {
            assert.include(err.toString(), "Result not announced yet");
        }
    });

    it("Can't get result before it is announced", async () => {
        const option = await pollInstance.results.call(0);

        assert.equal(option.name, "", "Result is returned before announcing")
        assert.equal(option.count.toNumber(), 0, "Result is returned before announcing")

    });

    it("Owner can announce result", async () => {
        // Announce result from owner's account
        const transaction = await pollInstance.announceResult({
            from: accounts[0],
        });

        // Access logs from transaction
        const { logs } = transaction;
        assert.ok(Array.isArray(logs), "logs is not an array");
        assert.equal(logs.length, 1, "Multiple events are emitted");

        // Access events from logs
        const log = logs[0];
        assert.equal(log.event, "ResultAnnounced", "Incorrect event was emitted");
        assert.equal(log.args.winnerOption.name, "sumit", "Winner does not match");
        assert.equal(
            log.args.winnerOption.count,
            1,
            "Winner vote count does not match"
        );

        // Check if flag set
        const isResultAnnounced = await pollInstance.isResultAnnounced.call();
        assert.equal(isResultAnnounced, true, "Result flag not set");
    });

    it("Can't vote after results announced", async () => {
        try {
            // Vote after results are announced
            await pollInstance.vote(0, { from: accounts[3] });
        } catch (err) {
            assert.include(err.toString(), "Cannot vote after result announcement");
        }
    });

    it("Can get result after results announced", async () => {
        const winner = await pollInstance.getWinner.call();
        const winner1 = await pollInstance.results.call(0);

        assert.equal(winner.name, "sumit", "Winner does not match");
        assert.equal(winner1.name, "sumit", "Winner via results does not match");
        assert.equal(
            winner.count,
            1,
            "Winner vote count does not match"
        );
    });
});
