import React, { useState } from "react";
import { ethers } from "ethers";
import LoyaltyPointExchange from "../../build/contracts/LoyaltyPointExchange.json";
import { useNavigate } from "react-router-dom";

const contractAddress = "0x2c4b11c38793a8992D1a42044258e33C939A6A6e"; // Replace with your deployed contract address

const Login = () => {
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!window.ethereum) {
      setMessage("❌ Please install MetaMask to connect.");
      return;
    }

    try {
      setLoading(true);
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(account);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, LoyaltyPointExchange.abi, signer);

      const owner = await contract.owner();
      setOwnerAddress(owner);

      if (account.toLowerCase() === owner.toLowerCase()) {
        setRole("Owner");
        setMessage("👑 Logged in as Owner.");
        navigate("/pages/OwnerPanel");
        return;
      }

      const userRole = await contract.getMyRole();

      if (userRole === 1) {
        setRole("User");
        setMessage("👤 Logged in as User.");
        navigate("/UserPanel");
      } else if (userRole === 2) {
        setRole("Merchant");
        setMessage("🛍️ Logged in as Merchant.");
        navigate("/MerchantPanel");
      } else {
        setRole("Unregistered");
        setMessage("⚠️ You are not registered.");
        navigate("/register/user");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("❌ Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex flex-col justify-center items-center px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">🔐 Login</h1>
        <p className="text-gray-700 mb-6">Connect your MetaMask wallet to continue.</p>

        <p className="mb-4 font-medium text-purple-800">
          Connected: {account || "Not connected"}
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogin}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Checking..." : "Login with MetaMask"}
          </button>
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-purple-100 text-purple-800 font-semibold shadow-sm animate-pulse">
            {message}
          </div>
        )}

        {role && (
          <div className="mt-4 text-lg font-semibold text-purple-900">
            Role: {role}
          </div>
        )}

        {ownerAddress && (
          <div className="mt-4 text-lg font-semibold text-purple-900 break-all">
            Owner Address: {ownerAddress}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

