import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const LeftNav = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Function to toggle collapse state manually
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // Function to detect window size and automatically collapse on smaller screens
    const handleResize = () => {
        if (window.innerWidth <= 768) { // Define the breakpoint, for example, 768px for tablets and mobile
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    };

    // Hook to listen for window resizing to update the state
    useEffect(() => {
        // Set initial collapse state based on the current screen size
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update `isActive` to check the current route
    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            className={`bg-gray-800 bg-opacity-30 text-white h-auto
            lg:w-[15%] sm:w-40 flex flex-col 
            ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}
        >
            <div className="flex items-center justify-between p-4 border-gray-700 text-black">
                <h1
                    className={`text-2xl font-bold transition-all duration-300 
                    ${collapsed ? 'hidden' : 'block'}`}
                >
                    KEYTRA IMS
                </h1>
                <button onClick={toggleCollapse} className="focus:outline-none">
                    {collapsed ? (
                        <i className="fas fa-bars"></i> // Hamburger icon for collapsed state
                    ) : (
                        <i className="fas fa-chevron-left"></i> // Close icon for expanded state
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
                            ${isActive('/orders') ? 'bg-gray-900 text-white font-bold' : ''} 
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
                            ${isActive('/transactions') ? 'bg-gray-900 text-white font-bold' : ''} 
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
