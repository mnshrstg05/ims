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
import CreateUser from './pages/CreateUser'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Try to load auth state from localStorage on initial load
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });

  useEffect(() => {
    // Save to localStorage whenever isAuthenticated changes
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    // console.log("Current Location:", window.location.pathname);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        {isAuthenticated ? (
          <div className="flex flex-1 h-screen">
            <LeftNav />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header setIsAuthenticated={setIsAuthenticated} />
              <main className="flex-1 overflow-auto p-3">
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
                
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
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
}


export default App;
