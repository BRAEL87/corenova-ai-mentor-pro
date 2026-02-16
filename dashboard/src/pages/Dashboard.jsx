import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, BookOpen, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import API_BASE_URL from '../config';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_BASE_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    const statCards = [
        { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Active Today', value: stats?.activeToday || 0, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Lessons Finished', value: stats?.lessonsCompleted || 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'AI Responses', value: stats?.messagesSent || 0, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const chartData = [
        { name: 'Mon', value: 12 },
        { name: 'Tue', value: 19 },
        { name: 'Wed', value: 15 },
        { name: 'Thu', value: 22 },
        { name: 'Fri', value: 30 },
        { name: 'Sat', value: 10 },
        { name: 'Sun', value: 8 },
    ];

    return (
        <div className="space-y-8 page-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1">Platform performance and student engagement.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2 text-emerald-600">
                    <TrendingUp size={18} />
                    <span className="text-sm font-bold">+12.5% this week</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Weekly Engagement</h2>
                    <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-lg px-3 py-1 outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 4 ? '#4f46e5' : '#e2e8f0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
