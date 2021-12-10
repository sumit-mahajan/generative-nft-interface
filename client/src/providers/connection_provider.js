import React, { useContext, useEffect, useState } from "react";
import Marketplace from "../contracts/Marketplace.json";
import CustomCollection from "../contracts/CustomCollection.json";
import Web3 from "web3";

//TODO: Set test/production mode
const isTest = true;

const ConnectionContext = React.createContext();

export function useConnection() {
  return useContext(ConnectionContext);
}

export function ConnectionProvider(props) {
  const [connectionState, setConnectionState] = useState({
    web3: null,
    networkName: isTest ? "Localhost" : "Mumbai",
    accounts: [],
    mContract: null,
    errors: null,
  });

  const initiate = async () => {
    if (connectionState.web3) return;

    try {
      // Use local web3 object by default before user connects metamask
      const provider = new Web3.providers.HttpProvider(
        isTest ?
          "http://127.0.0.1:7545" :
          "https://rpc-mumbai.maticvigil.com"
      );
      const web3 = new Web3(provider);

      const mContract = await createMarketplaceInstance(web3);

      setConnectionState({
        ...connectionState,
        web3,
        mContract,
        networkName: isTest ? "Localhost" : "Mumbai",
      });
    } catch (e) {
      console.log("useConnection Error ", e);
      if (e !== "Use Correct Network") {
        e = "Can't connect to Mumbai testnet right now. Try again after some time"
      } else {
        e = "You are using wrong network. Switch to " + isTest ? "Localhost 7545" : "Mumbai Testnet";
      }

      setConnectionState({ ...connectionState, errors: e });
    }
  };

  async function createMarketplaceInstance(web3) {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      console.log("IsTest: ", isTest);
      if (isTest) {
        // Localhost 7545
        const deployedNetwork = Marketplace.networks[networkId];

        if (deployedNetwork) {
          const newInstance = new web3.eth.Contract(
            Marketplace.abi,
            deployedNetwork.address
          );

          return newInstance;
        } else {
          throw "Use Correct Network";
        }
      } else {
        // Mumbai
        const newInstance = new web3.eth.Contract(
          Marketplace.abi,
          process.env.REACT_APP_MUMBAI_CONTRACT_ADDRESS
        );

        return newInstance;
      }
    }
  }

  async function createCollectionInstance(web3, cAddress) {
    return new web3.eth.Contract(
      CustomCollection.abi,
      cAddress
    );
  }

  useEffect(() => {
    initiate();
    connectWallet();

    // Detect metamask account change
    window.ethereum.on("accountsChanged", async function (_accounts) {
      const web3 = await getWeb3();
      const mContract = await createMarketplaceInstance(web3);
      setConnectionState({
        ...connectionState,
        web3,
        accounts: _accounts,
        mContract,
      });
    });

    // Detect metamask network change
    window.ethereum.on("networkChanged", function (networkId) {
      window.location.reload();
    });
  }, []);

  const connectWallet = async () => {
    try {
      // Get web3 injected by metamask
      const web3 = await getWeb3();

      const networkId = await web3.eth.net.getId();

      let networkName = "Private";

      // Set networkName for navbar
      switch (networkId) {
        case 137:
          networkName = "Matic Mainnet";
          break;
        case 80001:
          networkName = "Mumbai Testnet";
          break;
        case 1:
          networkName = "Ethereum Mainnet";
          break;
        case 4:
          networkName = "Rinkeby Testnet";
          break;
        case 5777:
          networkName = "Localhost 7545";
          break;
        default:
          networkName = "Unknown";
      }

      const accounts = await web3.eth.getAccounts();

      const mContract = await createMarketplaceInstance(web3);

      setConnectionState({
        ...connectionState,
        web3,
        networkName,
        accounts,
        mContract,
      });
    } catch (e) {
      if (e === "Use Correct Network") {
        e = "You are using wrong network. Switch to " + (isTest ? "Localhost 7545" : "Mumabi Testnet");
      }
      console.log("useConnection Error ", e);
      setConnectionState({ ...connectionState, errors: e });
    }
  };

  // Method for switching accounts programmatically
  const switchNetwork = async () => {
    // await window.ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{ chainId: 1337 }],
    // });
  };

  return (
    <>
      <ConnectionContext.Provider
        value={{
          connectionState,
          setConnectionState,
          connectWallet,
          switchNetwork,
        }}
      >
        {props.children}
      </ConnectionContext.Provider>
    </>
  );
}

const getWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Accounts now exposed
      return web3;
    } catch (error) {
      throw error;
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    return web3;
  }
};
