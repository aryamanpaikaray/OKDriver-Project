import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, LayoutDashboard, UserPlus } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <ShieldAlert size={26} className="text-blue-500" />
                    <span className="text-lg font-extrabold tracking-tight text-white">OKDriver</span>
                    <span className="text-xs font-mono text-gray-500 self-end mb-0.5">v1.0</span>
                </div>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors
                            ${isActive ? 'bg-blue-500/15 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
                        }
                    >
                        <LayoutDashboard size={16} />
                        Fleet Dashboard
                    </NavLink>

                    <NavLink
                        to="/drivers"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors
                            ${isActive ? 'bg-blue-500/15 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
                        }
                    >
                        <Users size={16} />
                        Drivers
                    </NavLink>

                    {/* CTA button */}
                    <NavLink
                        to="/drivers/add"
                        className={({ isActive }) =>
                            `ml-2 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors border
                            ${isActive
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white'}`
                        }
                    >
                        <UserPlus size={16} />
                        Add Driver
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
