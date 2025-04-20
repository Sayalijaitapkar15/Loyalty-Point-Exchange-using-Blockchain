import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

export const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          const browserProvider = new BrowserProvider(window.ethereum);
          setProvider(browserProvider);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, provider, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
