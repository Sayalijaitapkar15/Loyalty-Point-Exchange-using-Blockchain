import React, { useContext, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { connectWallet, account, contract } = useContext(WalletContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (typeof window.ethereum === "undefined") {
      setMessage("🦊 Please install MetaMask to use the app.");
      return;
    }

    try {
      setLoading(true);
      await connectWallet();
      if (!contract || !account) return;

      const owner = await contract.methods.owner().call();

      console.log("📢 Contract Owner Address:", owner); // 👈 This logs the owner address
      console.log("🧠 Connected Wallet Address:", account); // 👈 This logs the connected wallet
      
      if (owner.toLowerCase() === account.toLowerCase()) {
        setMessage("👑 Welcome back, Owner!");
        setTimeout(() => navigate("/owner"), 1500);
        return;
      }

      const isMerchant = await contract.methods.isMerchant(account).call();
      if (isMerchant) {
        const name = await contract.methods.merchantNames(account).call();
        setMessage(`🛍️ Welcome back, ${name}!`);
        setTimeout(() => navigate("/merchant"), 1500);
        return;
      }

      const isUser = await contract.methods.isUser(account).call();
      if (isUser) {
        const name = await contract.methods.userNames(account).call();
        setMessage(`👋 Welcome back, ${name}!`);
        setTimeout(() => navigate("/user"), 1500);
        return;
      }

      setMessage("⚠️ You are not registered. Please register first.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex flex-col justify-center items-center px-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">🔐 Login</h1>
        <p className="text-gray-700 mb-6">
          Connect your MetaMask wallet to continue.
        </p>

        <button
          onClick={handleLogin}
          className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-purple-100 text-purple-800 font-semibold shadow-sm animate-pulse">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
