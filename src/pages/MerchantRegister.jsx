import React, { useState } from "react";

const MerchantRegister = () => {
  const [merchantName, setMerchantName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleRegister = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).requestMerchant(merchantName);
      await tx.wait();
      alert("Merchant registration request sent to the Owner.");
    } catch (error) {
      console.error(error);
      alert("Failed to request merchant registration.");
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
          <input
            type="text"
            placeholder="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="p-3 border rounded-lg outline-green-400"
          />
          <button
            onClick={handleRegister}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-semibold"
          >
            Request as Merchant
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegister;
