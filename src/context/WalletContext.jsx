// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import LoyaltyPointExchangeJSON  from "../../build/contracts/LoyaltyPointExchange.json";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount]     = useState(null);
  const [signer, setSigner]       = useState(null);
  const [contract, setContract]   = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("🦊 Please install MetaMask!");
        return;
      }

      // Ask user to connect their wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create a provider that works on any network (disables ENS errors)
      const provider = new ethers.BrowserProvider(window.ethereum, "any");

      // Get the signer (the connected account)
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Instantiate your contract with just the ABI array
      const contract = new ethers.Contract(
        "0x2c4b11c38793a8992D1a42044258e33C939A6A6e",
        LoyaltyPointExchangeJSON.abi,
        signer
      );

      // Save everything in state
      setAccount(address);
      setSigner(signer);
      setContract(contract);

    } catch (error) {
      console.error("🔌 Wallet connection failed:", error);
    }
  };

  // Listen for account or network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, signer, contract, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
