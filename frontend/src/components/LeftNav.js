import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const LeftNav = () => {
    const location = useLocation();

    // Set initial collapsed state based on window width
    const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);

    // Toggle collapse manually
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // Auto-collapse on window resize
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    };

    useEffect(() => {
        // Run once on mount
        handleResize();

        // Resize listener
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Collapse nav on route change for small screens
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    }, [location.pathname]);

    // Check active route
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav
            className={`bg-gray-800 bg-opacity-30 text-white h-auto
            flex flex-col transition-all duration-300
            ${collapsed ? 'w-20' : 'w-64'}
            sm:fixed sm:z-50 sm:h-screen sm:top-0 sm:left-0 sm:shadow-lg
            lg:relative lg:w-[15%]'`}
        >
            <div className="flex items-center justify-between p-4 border-gray-700 text-black">
                <h1
                    className={`text-2xl font-bold transition-all duration-300 
                    ${collapsed ? 'hidden' : 'block'}`}
                >
                    KEYTRA IMS
                </h1>
                <button onClick={toggleCollapse} className="focus:outline-none text-white">
                    {collapsed ? (
                        <i className="fas fa-bars"></i>
                    ) : (
                        <i className="fas fa-chevron-left"></i>
                    )}
                </button>
            </div>

            <nav className="py-2 flex-1 text-black">
                <ul>
                    <li>
                        <Link
                            to="/dashboard"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/dashboard') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-house mr-3"></i>
                            {!collapsed && 'Dashboard'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/products') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-box-open mr-3"></i>
                            {!collapsed && 'Products'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/inventory"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/inventory') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-cart-flatbed mr-3"></i>
                            {!collapsed && 'Inventory'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/categories"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/categories') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-table-list mr-3"></i>
                            {!collapsed && 'Categories'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/vouchers"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/vouchers') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-chart-line mr-3"></i>
                            {!collapsed && 'Voucher'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/delivery-report"
                            className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                            ${isActive('/delivery-report') ? 'bg-gray-900 text-white font-bold' : ''} 
                            ${collapsed ? 'text-center' : ''}`}
                        >
                            <i className="fa-solid fa-money-bill-trend-up mr-3"></i>
                            {!collapsed && 'Delivery Report'}
                        </Link>
                    </li>
                </ul>
            </nav>
        </nav>
    );
};

export default LeftNav;
