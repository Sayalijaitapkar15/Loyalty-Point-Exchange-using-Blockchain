import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-200 p-6">
      
      {/* Description Section */}
      <div className="max-w-4xl w-full text-center text-lg mb-12 bg-white/40 backdrop-blur-lg text-gray-800 p-8 rounded-2xl shadow-xl border border-white/30">
        <p className="mb-4 text-2xl font-semibold text-blue-900">
          Welcome to the Loyalty Point Exchange DApp – A blockchain-based reward system!
        </p>
        <p className="mb-4">
          Earn loyalty points automatically when you purchase items through our partner merchants. Use those points to redeem other items – all tracked transparently using blockchain.
        </p>

        <div className="text-left mt-6 space-y-3">
          <p className="text-lg font-semibold text-purple-700">💡 Key Features:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><b>Earn Loyalty Points:</b> Points are earned through purchases made via registered merchants.</li>
            <li><b>One Wallet, All Points:</b> All points are stored securely in your digital wallet.</li>
            <li><b>Redeem Items:</b> Use earned loyalty points to buy items from various merchants.</li>
            <li><b>Blockchain Security:</b> Every transaction is stored securely on the Ethereum network.</li>
            <li><b>Wallet Authentication:</b> Seamless access using MetaMask without usernames or passwords.</li>
            <li><b>Decentralized Access:</b> No central authority – fully user-owned ecosystem.</li>
          </ul>
        </div>

        <p className="mt-6 font-bold text-yellow-500">
          Buy, earn, and redeem with complete transparency — all powered by blockchain!
        </p>
      </div>

      {/* Register Now Section */}
      <div className="bg-white text-blue-800 p-10 rounded-3xl shadow-2xl max-w-xl w-full flex flex-col items-center border-4 border-yellow-300 hover:scale-105 transform transition-all duration-300">
        <h2 className="text-3xl font-extrabold mb-4 text-center">📝 Register Now</h2>
        <p className="text-center text-base text-gray-700 mb-6">
          Users and Merchants can register to join the ecosystem using their wallet address.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => navigate("/register/user")}
            className="bg-blue-500 py-3 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
          >
            Register as User
          </button>
          <button
            onClick={() => navigate("/register/merchant")}
            className="bg-green-500 py-3 text-white rounded-lg text-lg shadow-md hover:bg-green-600"
          >
            Register as Merchant
          </button>
        </div>
      </div>

      {/* Login Button */}
      <div className="mt-10">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-purple-100"
        >
          Already Registered? Login
        </button>
      </div>
    </div>
  );
};

export default Home;
