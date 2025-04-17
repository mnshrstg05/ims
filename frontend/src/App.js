import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LeftNav from './components/LeftNav';
import Footer from './components/Footer';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import ProductPage from './pages/Product';
import AddProductForm from './components/AddProductForm';
import AddInventoryForm from './components/AddInventoryForm';
import EditInventoryForm from './components/EditInventoryForm';
import EditProductForm from './components/EditProductForm';
import CategoriesPage from './pages/CategoriesPage';
import VoucherPage from './pages/VoucherPage';
import DeliveryReport from './pages/DeliveryReport';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateUser from './pages/CreateUser';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 Added missing state
  const [showMobileNav, setShowMobileNav] = useState(false); // 👈 Added this line


  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://ims-3cdk.onrender.com/auth/check', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          sessionStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
        sessionStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) return <div className="text-center mt-20 text-lg">Checking session...</div>; // 🔥 Prevents jump to login

  return (
    <Router>
    <div className="flex min-h-screen">
      {isAuthenticated ? (
        <>
          <LeftNav showMobileNav={showMobileNav} setShowMobileNav={setShowMobileNav} />
          
          {/* Main content area */}
          <div className="flex flex-col flex-1">
            <Header setIsAuthenticated={setIsAuthenticated} onToggleMobileNav={() => setShowMobileNav(prev => !prev)} />
  
            {/* Scrollable content with footer below */}
            <div className="flex flex-col flex-1 overflow-auto">
              <main className="flex-1 p-3">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/inventory/edit/:id" element={<EditInventoryForm />} />
                  <Route path="/products/edit-product/:productId" element={<EditProductForm />} />
                  <Route path="/inventory/add-product" element={<AddInventoryForm />} />
                  <Route path="/products/add-product" element={<AddProductForm />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/vouchers" element={<VoucherPage />} />
                  <Route path="/delivery-report" element={<DeliveryReport />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<CreateUser />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  </Router>
  
  );
};

export default App;
