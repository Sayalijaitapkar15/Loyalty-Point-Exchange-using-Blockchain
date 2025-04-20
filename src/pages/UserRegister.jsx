import React, { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractConfig";
const provider = new ethers.BrowserProvider(window.ethereum);

const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
const UserRegister = () => {
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
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

      // Connect to wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerUser(fullName); // fullName = "Sayali"
      await tx.wait();

      const walletAddress = await signer.getAddress();
      localStorage.setItem("user", JSON.stringify({ name: fullName, wallet: walletAddress }));
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
            onClick={handleRegister}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
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
