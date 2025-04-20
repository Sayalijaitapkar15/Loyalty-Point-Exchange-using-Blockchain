// src/pages/OwnerPanel.jsx

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractConfig"; // Adjust path as needed

const OwnerPanel = () => {
  const [contract, setContract] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMerchants, setTotalMerchants] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingMerchants, setPendingMerchants] = useState([]);

  // Set up contract on mount
  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(instance);
      } else {
        console.error("MetaMask not detected");
      }
    };

    initContract();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchAnalytics();
      fetchPendingMerchants();
    }
  }, [contract]);

  const fetchAnalytics = async () => {
    try {
      const users = await contract.getTotalUsers();
      const merchants = await contract.getTotalMerchants();
      const sales = await contract.getTotalSales(); // Assuming this function exists
      setTotalUsers(users.toNumber());
      setTotalMerchants(merchants.toNumber());
      setTotalSales(ethers.formatEther(sales)); // if sales are in wei
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const fetchPendingMerchants = async () => {
    try {
      const requests = await contract.getPendingMerchants();
      setPendingMerchants(requests);
    } catch (err) {
      console.error("Error fetching pending merchants:", err);
    }
  };

  const approveMerchant = async (address) => {
    try {
      const tx = await contract.approveMerchant(address);
      await tx.wait();
      alert("Merchant approved!");
      fetchPendingMerchants(); // Refresh list
    } catch (err) {
      console.error("Error approving merchant:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">👑 Owner Dashboard</h1>

      {/* Admin Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-gray-700">Total Merchants</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalMerchants}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-700">Total Sales (ETH)</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalSales}</p>
        </div>
      </div>

      {/* Pending Merchant Approval Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Pending Merchant Requests</h2>
        {pendingMerchants.length === 0 ? (
          <p className="text-gray-500">No pending merchant requests.</p>
        ) : (
          <ul className="space-y-3">
            {pendingMerchants.map((addr, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <span className="text-gray-800 font-mono">{addr}</span>
                <button
                  onClick={() => approveMerchant(addr)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OwnerPanel;
