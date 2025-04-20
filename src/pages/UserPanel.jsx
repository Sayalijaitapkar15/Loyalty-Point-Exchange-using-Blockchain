import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const UserPanel = ({ contract }) => {
  const [userData, setUserData] = useState({});
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    const loadUserData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserData(user);
        setPoints(user.points || 100);
        setHistory([
          { action: "Earned", amount: 50, source: "Coffee Shop" },
          { action: "Spent", amount: 20, item: "T-Shirt" },
        ]);
      }
    };

    const fetchItems = async () => {
      try {
        const itemCount = await contract.itemCount();
        const items = [];
        for (let i = 1; i <= itemCount; i++) {
          const item = await contract.items(i);
          if (item.isActive) {
            items.push({
              id: i,
              name: item.name,
              etherCost: item.etherPrice.toString(),
              pointCost: item.loyaltyPrice.toNumber(),
              merchant: item.merchant,
              rewardPoints: item.rewardPoints.toNumber(),
            });
          }
        }
        setAvailableItems(items);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    loadUserData();
    if (contract) {
      fetchItems();
    }
  }, [contract]);

  const handleBuyWithEther = async (item) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).buyItemWithEther(item.id, {
        value: item.etherCost,
      });
      await tx.wait();

      alert(`🪙 You bought "${item.name}" with Ether!`);
      setHistory((prev) => [
        ...prev,
        { action: "Spent (ETH)", amount: ethers.formatEther(item.etherCost), item: item.name },
      ]);
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };

  const handleBuyWithPoints = async (item) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).buyItemWithPoints(item.id);
      const receipt = await tx.wait();

      setPoints((prev) => prev - item.pointCost + item.rewardPoints);
      alert(`✅ You bought "${item.name}" with points! Earned ${item.rewardPoints} bonus points.`);

      setHistory((prev) => [
        ...prev,
        { action: "Spent", amount: item.pointCost, item: item.name },
        { action: "Earned", amount: item.rewardPoints, source: item.name },
      ]);
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          👋 Welcome, {userData.name || "User"}
        </h2>

        <div className="bg-purple-100 p-6 rounded-xl text-center mb-10">
          <p className="text-xl font-semibold text-purple-900">Your Loyalty Points</p>
          <p className="text-5xl text-purple-800 font-bold mt-2">{points}</p>
        </div>

        <h3 className="text-2xl font-bold text-gray-700 mb-4">🛍️ Available Items</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {availableItems.map((item) => (
            <div key={item.id} className="bg-blue-50 p-4 rounded-lg shadow-md flex flex-col">
              <p className="text-xl font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-700">Cost: {ethers.formatEther(item.etherCost)} ETH</p>
              <p className="text-gray-700 mb-4">Or {item.pointCost} points</p>
              <button
                onClick={() => handleBuyWithEther(item)}
                className="bg-yellow-500 text-white px-4 py-2 mb-2 rounded hover:bg-yellow-600"
              >
                Buy with Ether
              </button>
              <button
                onClick={() => handleBuyWithPoints(item)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Buy with Points
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">🧾 Transaction History</h3>
        <ul className="space-y-3">
          {history.map((h, i) => (
            <li
              key={i}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between"
            >
              <span className="text-gray-800">
                {h.action === "Earned"
                  ? `+${h.amount} from ${h.source}`
                  : h.action === "Spent (ETH)"
                  ? `-${h.amount} ETH for ${h.item}`
                  : `-${h.amount} pts for ${h.item}`}
              </span>
              <span
                className={`font-bold ${
                  h.action === "Earned"
                    ? "text-green-600"
                    : h.action.includes("ETH")
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {h.action}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
