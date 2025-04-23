import React, { useState, useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const MerchantRegister = () => {
  const [merchantName, setMerchantName] = useState("");
  const [message, setMessage] = useState("");
  const { contract, account, connectWallet } = useContext(WalletContext);

  const handleRequestMerchant = async () => {
    if (!window.ethereum) {
      alert("🦊 Please install MetaMask to request access.");
      return;
    }

    if (!merchantName.trim()) {
      alert("⚠️ Please enter your merchant name.");
      return;
    }

    if (!contract) {
      alert("Smart contract not loaded. Please connect your wallet.");
      return;
    }

    try {
      const tx = await contract.requestMerchant(merchantName);
      await tx.wait();

      setMessage(`✅ Merchant request for "${merchantName}" submitted successfully!`);
      setMerchantName("");

    } catch (error) {
      console.error("❌ Request failed:", error);
      setMessage("❌ Request failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-yellow-200 p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md border border-green-200">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          🛍️ Merchant Registration
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Merchant Name"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            className="p-3 border rounded-lg outline-green-400"
          />

          <button
            onClick={connectWallet}
            className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all font-semibold"
          >
            {account ? "✅ Wallet Connected" : "Connect Wallet"}
          </button>

          <button
            onClick={handleRequestMerchant}
            disabled={!account}
            className={`py-3 rounded-lg font-semibold transition-all ${
              account
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Request as Merchant
          </button>

          {message && (
            <p className="text-center font-medium text-sm text-gray-700 mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantRegister;
