import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MerchantPanel = () => {
  const { contract, account } = useContext(WalletContext);
  const [itemName, setItemName] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [loyaltyPrice, setLoyaltyPrice] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [merchantItems, setMerchantItems] = useState([]);

  const fetchMerchantItems = async () => {
    if (!contract || !account) return;

    try {
      const items = await contract.methods.getItemsByMerchant(account).call();
      setMerchantItems(items);
    } catch (error) {
      console.error("Error fetching merchant items:", error);
    }
  };

  useEffect(() => {
    fetchMerchantItems();
  }, [contract, account]);

  const addItem = async (e) => {
    e.preventDefault();

    if (!contract || !account) {
      toast.error("❌ Wallet not connected or contract unavailable.");
      return;
    }

    if (!itemName || ethPrice <= 0 || loyaltyPrice < 0 || rewardPoints < 0) {
      toast.warn("⚠️ Please fill all fields with valid values.");
      return;
    }

    try {
      setLoading(true);
      const ethPriceInWei = window.web3.utils.toWei(ethPrice, "ether");

      await contract.methods
        .addItem(itemName, ethPriceInWei, loyaltyPrice, rewardPoints)
        .send({ from: account });

      toast.success("✅ Item added successfully to the blockchain!");
      setItemName("");
      setEthPrice("");
      setLoyaltyPrice("");
      setRewardPoints("");

      fetchMerchantItems(); // refresh items
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("❌ Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      await contract.methods.deleteItem(itemId).send({ from: account });
      toast.success("🗑️ Item deleted!");
      fetchMerchantItems();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Could not delete item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-blue-200 px-6 py-10 flex flex-col items-center">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-10 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">🛒 Merchant Dashboard</h1>
        <form onSubmit={addItem} className="space-y-6">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Item Name"
            required
          />
          <input
            type="number"
            step="0.0001"
            value={ethPrice}
            onChange={(e) => setEthPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ether Price (e.g. 0.01)"
            required
          />
          <input
            type="number"
            value={loyaltyPrice}
            onChange={(e) => setLoyaltyPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Loyalty Points"
            required
          />
          <input
            type="number"
            value={rewardPoints}
            onChange={(e) => setRewardPoints(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Reward Points After Purchase"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            {loading ? "Adding Item..." : "Add Item to Blockchain"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Your Items on Blockchain</h2>
          {merchantItems.length === 0 ? (
            <p className="text-gray-600">No items added yet.</p>
          ) : (
            <ul className="space-y-4">
              {merchantItems.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p>ETH: {window.web3.utils.fromWei(item.ethPrice, "ether")}</p>
                    <p>Loyalty: {item.loyaltyPrice}</p>
                    <p>Reward: {item.rewardPoints}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantPanel;

