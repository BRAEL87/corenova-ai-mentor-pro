import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/' },
        { name: 'Students', icon: Users, path: '/students' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/login';
    };

    return (
        <div className="h-screen w-64 bg-white/80 backdrop-blur-lg border-r border-slate-100 flex flex-col shadow-sm">
            <div className="p-8">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">CoreNova</h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest pl-10">AI Mentor Pro</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 ${location.pathname === item.path
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 bg-slate-50/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-slate-400 p-3.5 w-full hover:bg-red-50 hover:text-red-600 transition-all rounded-xl font-semibold text-sm"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
