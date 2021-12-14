import React, { useContext, useEffect, useState } from "react";
import Marketplace from "../contracts/Marketplace.json";
import CustomCollection from "../contracts/CustomCollection.json";
import Web3 from "web3";

//TODO: Set test/production mode
const isTest = false;

const ConnectionContext = React.createContext();

export function useConnection() {
  return useContext(ConnectionContext);
}

export function ConnectionProvider(props) {
  const [connectionState, setConnectionState] = useState({
    web3: null,
    networkName: isTest ? "Localhost 7545" : "Mumbai Testnets",
    accounts: [],
    mContract: null,
    errors: null,
  });

  // const initiate = async () => {
  //   if (connectionState.web3) return;

  //   try {
  //     // Use local web3 object by default before user connects metamask
  //     const provider = new Web3.providers.HttpProvider(
  //       isTest ?
  //         "http://127.0.0.1:7545" :
  //         "https://rpc-mumbai.maticvigil.com"
  //     );
  //     const web3 = new Web3(provider);

  //     const mContract = await createMarketplaceInstance(web3);

  //     setConnectionState({
  //       ...connectionState,
  //       web3,
  //       mContract,
  //       networkName: isTest ? "Localhost 7545" : "Mumbai Testnet",
  //     });
  //   } catch (e) {
  //     console.log("useConnection : initiate -> Error ", e);
  //     if (e === "WN") {
  //       e = "You are using wrong network. Switch to " + isTest ? "Localhost 7545" : "Mumbai Testnet";
  //     }
  //     setConnectionState({ ...connectionState, errors: e });
  //   }
  // };

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
      console.log("useConnection : connectWallet -> Error ", e);
      if (e === "WN") {
        e = "You are using wrong network. Switch to " + (isTest ? "Localhost 7545" : "Mumabi Testnet");
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
        if (networkId !== 5777) {
          throw "WN";
        }
        const deployedNetwork = Marketplace.networks[networkId];

        if (deployedNetwork) {
          const newInstance = new web3.eth.Contract(
            Marketplace.abi,
            deployedNetwork.address
          );

          return newInstance;
        } else {
          throw "Contract not depoyed on localhost";
        }
      } else {
        // Mumbai
        if (networkId !== 80001) {
          throw "WN";
        }
        const newInstance = new web3.eth.Contract(
          Marketplace.abi,
          // "0x0BbE047979B7587213eebda55f98ec721Ce9E723"
          "0x16260105f1cC8bb5CcE7A39C62758AAcd3a8ab7C" // Only generative
          // process.env.REACT_APP_MUMBAI_CONTRACT_ADDRESS
        );

        return newInstance;
      }
    }
  }

  async function createCollectionInstance(web3, cAddress) {
    return await new web3.eth.Contract(
      CustomCollection.abi,
      cAddress
    );
  }

  useEffect(() => {
    // initiate();
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

  return (
    <>
      <ConnectionContext.Provider
        value={{
          connectionState,
          setConnectionState,
          connectWallet,
          createCollectionInstance,
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
