import React, { useState, useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const { contract, account, connectWallet } = useContext(WalletContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!window.ethereum) {
        alert("🦊 Please install MetaMask to register.");
        return;
      }

      if (!fullName.trim()) {
        alert("⚠️ Please enter your full name.");
        return;
      }

      if (!contract) {
        alert("Smart contract not loaded. Please connect your wallet first.");
        return;
      }

      // Register the user via contract
      const tx = await contract.registerUser(fullName);
      await tx.wait();

      localStorage.setItem("user", JSON.stringify({ name: fullName, wallet: account }));
      setMessage("✅ Registration successful!");
      navigate("/UserPanel");

    } catch (error) {
      console.error("❌ Registration failed:", error);
      setMessage("❌ Registration failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-purple-200 p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md border border-blue-200">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          👤 User Registration
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-3 border rounded-lg outline-blue-400"
          />

          <button
            onClick={connectWallet}
            className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all font-semibold"
          >
            {account ? "✅ Wallet Connected" : "Connect Wallet"}
          </button>

          <button
            onClick={handleRegister}
            disabled={!account}
            className={`py-3 rounded-lg font-semibold transition-all ${
              account
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Register as User
          </button>

          {message && (
            <p className="text-center font-medium text-sm text-gray-700 mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
