import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaBox, FaTags } from 'react-icons/fa';

const Dashboard = () => {
    const [totalProducts, setTotalProducts] = useState(() => Number(localStorage.getItem('totalProducts')) || 0);
    const [totalCategories, setTotalCategories] = useState(() => Number(localStorage.getItem('totalCategories')) || 0);
    const [totalDeliveryReports, setTotalDeliveryReports] = useState(() => Number(localStorage.getItem('totalDeliveryReports')) || 0);
    const [totalVouchers, setTotalVouchers] = useState(() => Number(localStorage.getItem('totalVouchers')) || 0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    productsResponse,
                    categoriesResponse,
                    vouchersResponse
                ] = await Promise.all([
                    axios.get('https://ims-3cdk.onrender.com/products/all-products', {
                        headers: { 'Cache-Control': 'no-cache' }
                    }),
                    axios.get('https://ims-3cdk.onrender.com/categories/all-category', {
                        headers: { 'Cache-Control': 'no-cache' }
                    }),
                    axios.get('https://ims-3cdk.onrender.com/vouchers/get-vouchers', {
                        headers: { 'Cache-Control': 'no-cache' }
                    }),
                ]);

                const totalProducts = productsResponse.data.length;
                const totalCategories = categoriesResponse.data.length;
                const totalVouchers = vouchersResponse.data.length;

                // Update state
                setTotalProducts(totalProducts);
                setTotalCategories(totalCategories);
                setTotalDeliveryReports(totalVouchers);
                setTotalVouchers(totalVouchers);

                // Cache data
                localStorage.setItem('totalProducts', totalProducts);
                localStorage.setItem('totalCategories', totalCategories);
                localStorage.setItem('totalDeliveryReports', totalVouchers);
                localStorage.setItem('totalVouchers', totalVouchers);

            } catch (err) {
                console.error('Error fetching data:', err);
                // Optional: show toast or log error silently
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex flex-1">
                <main className="flex-1 p-6 transition-opacity duration-300 ease-in">
                    <h1 className="text-3xl font-semibold mb-4 text-teal-600">Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <StatCard icon={<FaBox />} title="Total Products" value={totalProducts} to="/products" color="text-blue-500" />
                        <StatCard icon={<FaTags />} title="Total Categories" value={totalCategories} to="/categories" color="text-purple-500" />
                        <StatCard icon={<FaBox />} title="Delivery Report" value={totalDeliveryReports} to="/delivery-report" color="text-teal-500" />
                        <StatCard icon={<FaTags />} title="Voucher" value={totalVouchers} to="/vouchers" color="text-orange-500" />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Voucher Status</h2>
                        <p className="text-3xl font-bold">{totalVouchers}</p>
                        <Link to="/delivery-report" className="text-blue-500 hover:underline mt-4 block">
                            View all vouchers
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, to, color }) => (
    <Link to={to} className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition">
        <div className={`text-4xl ${color}`}>
            {icon}
        </div>
        <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </Link>
);

export default Dashboard;
