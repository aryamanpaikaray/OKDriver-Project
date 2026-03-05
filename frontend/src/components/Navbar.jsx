import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, Users, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={28} className="text-blue-500" />
                    <span className="text-xl font-bold tracking-tight text-white">OKDriver Command</span>
                </div>

                <div className="flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-gray-400'}`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Global Dashboard
                    </NavLink>
                    <NavLink
                        to="/drivers"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-gray-400'}`
                        }
                    >
                        <Users size={18} />
                        Driver Management
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
