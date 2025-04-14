import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const LeftNav = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const location = useLocation();

    // Toggle for large screen collapse
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    // Toggle for mobile nav visibility
    const toggleMobileNav = () => {
        setShowMobileNav(!showMobileNav);
    };

    const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (!mobile) {
            setShowMobileNav(false); // Hide mobile nav when resizing to desktop
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <>
            {/* Mobile Hamburger Button */}
            {isMobile && (
                <button
                    onClick={toggleMobileNav}
                    className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-md"
                >
                    <i className="fas fa-bars text-lg"></i>
                </button>
            )}

            {/* Sidebar */}
            <nav
                className={`bg-gray-800 text-white h-full z-40
                ${isMobile
                    ? `fixed top-0 left-0 transition-transform duration-300 ease-in-out
                       ${showMobileNav ? 'translate-x-0' : '-translate-x-full'} w-64`
                    : `lg:w-[15%] sm:w-40 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h1 className={`text-2xl font-bold ${collapsed && !isMobile ? 'hidden' : ''}`}>
                        KEYTRA IMS
                    </h1>
                    {!isMobile && (
                        <button onClick={toggleCollapse} className="focus:outline-none">
                            {collapsed ? <i className="fas fa-bars"></i> : <i className="fas fa-chevron-left"></i>}
                        </button>
                    )}
                    {isMobile && (
                        <button onClick={toggleMobileNav} className="focus:outline-none">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="py-2 text-black overflow-y-auto flex-1">
                    <ul>
                        {[
                            { to: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
                            { to: '/products', icon: 'fa-box-open', label: 'Products' },
                            { to: '/inventory', icon: 'fa-cart-flatbed', label: 'Inventory' },
                            { to: '/categories', icon: 'fa-table-list', label: 'Categories' },
                            { to: '/vouchers', icon: 'fa-chart-line', label: 'Voucher' },
                            { to: '/delivery-report', icon: 'fa-money-bill-trend-up', label: 'Delivery Report' },
                        ].map(({ to, icon, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={() => isMobile && setShowMobileNav(false)} // Auto-close on mobile
                                    className={`block m-4 p-4 hover:bg-gray-800 rounded-xl hover:text-white 
                                        ${isActive(to) ? 'bg-gray-900 text-white font-bold' : ''}
                                        ${collapsed && !isMobile ? 'text-center' : ''}
                                    `}
                                >
                                    <i className={`fa-solid ${icon} mr-3`}></i>
                                    {!collapsed || isMobile ? label : ''}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </nav>

            {/* Optional Overlay for Mobile */}
            {isMobile && showMobileNav && (
                <div
                    onClick={toggleMobileNav}
                    className="fixed inset-0 bg-black opacity-40 z-30"
                />
            )}
        </>
    );
};

export default LeftNav;
