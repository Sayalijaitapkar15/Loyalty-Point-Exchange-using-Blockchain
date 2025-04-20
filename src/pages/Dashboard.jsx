import React from "react";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Welcome to Loyalty Point Dashboard</h1>

        {walletAddress ? (
          <>
            <p className="text-center text-gray-700 mb-6">
              Connected Wallet Address:
              <br />
              <span className="font-mono text-sm text-gray-900">{walletAddress}</span>
            </p>

            <div className="flex flex-col items-center space-y-4">
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg w-full hover:bg-purple-700"
                onClick={() => navigate("/owner")}
              >
                Owner Panel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700"
                onClick={() => navigate("/merchant")}
              >
                Merchant Panel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
                onClick={() => navigate("/user")}
              >
                User Panel
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">Wallet not connected. Please go back and connect your wallet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
