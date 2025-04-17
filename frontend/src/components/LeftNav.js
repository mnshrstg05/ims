import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const LeftNav = ({ showMobileNav, setShowMobileNav }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleMobileNav = () => setShowMobileNav(prev => !prev);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setShowMobileNav(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setShowMobileNav]);

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { to: '/dashboard', icon: 'fa-house', label: 'Dashboard' },
        { to: '/products', icon: 'fa-box-open', label: 'Products' },
        { to: '/inventory', icon: 'fa-cart-flatbed', label: 'Inventory' },
        { to: '/categories', icon: 'fa-table-list', label: 'Categories' },
        { to: '/vouchers', icon: 'fa-chart-line', label: 'Voucher' },
        { to: '/delivery-report', icon: 'fa-money-bill-trend-up', label: 'Delivery Report' },
    ];

    return (
        <>
            <nav
                className={`bg-gray-800 text-white z-40 flex flex-col
                    ${isMobile
                        ? `fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out
                           ${showMobileNav ? 'translate-x-0' : '-translate-x-full'} w-64`
                        : `${collapsed ? 'w-20' : 'w-64'} h-screen transition-all duration-300`}
                `}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h1 className={`text-2xl font-bold ${collapsed && !isMobile ? 'hidden' : ''}`}>KEYTRA IMS</h1>
                    {!isMobile ? (
                        <button onClick={toggleCollapse} className="focus:outline-none">
                            {collapsed ? <i className="fas fa-bars"></i> : <i className="fas fa-chevron-left"></i>}
                        </button>
                    ) : (
                        <button onClick={toggleMobileNav} className="focus:outline-none">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                {/* Scrollable Menu */}
                <div className="flex-1 overflow-y-auto py-2">
                    <ul>
                        {navItems.map(({ to, icon, label }) => (
                            <li key={to}>
                                <div className="relative group">
                                    <Link
                                        to={to}
                                        onClick={() => isMobile && setShowMobileNav(false)}
                                        className={`block m-4 p-4 rounded-xl hover:bg-gray-700 transition-all
                                            ${isActive(to) ? 'bg-gray-900 text-white font-bold' : ''}
                                            ${collapsed && !isMobile ? 'text-center' : ''}
                                        `}
                                        title={collapsed && !isMobile ? label : ''}
                                    >
                                        <i className={`fa-solid ${icon} ${!collapsed || isMobile ? 'mr-3' : ''}`}></i>
                                        {!collapsed || isMobile ? label : ''}
                                    </Link>

                                    {/* Tooltip on Hover */}
                                    {collapsed && !isMobile && (
                                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {label}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Background overlay for mobile nav */}
            {isMobile && showMobileNav && (
                <div onClick={toggleMobileNav} className="fixed inset-0 bg-black opacity-40 z-30" />
            )}
        </>
    );
};

export default LeftNav;
