import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import MerchantRegister from "./pages/MerchantRegister";
import UserPanel from "./pages/UserPanel";
import OwnerPanel from "./pages/OwnerPanel";
import MerchantPanel from "./pages/MerchantPanel";
import ProtectedRoute from "./routes/ProtectedRoute";
import { WalletProvider } from "./context/WalletContext";
import "./index.css";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/merchant" element={<MerchantRegister />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                <OwnerPanel />
              </ProtectedRoute>
            }
            />
          <Route
            path="/user-panel"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant-panel"
            element={
              <ProtectedRoute>
                <MerchantPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
        </Layout>
        </Router>
    </WalletProvider>
  );
}

export default App;
