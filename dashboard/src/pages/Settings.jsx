import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, BookOpen, Brain, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config';

const Settings = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // For now, we manage the first course (Intro to Python)
    const [editingCourse, setEditingCourse] = useState({
        id: '',
        name: '',
        systemPrompt: '',
        welcomeMessage: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_BASE_URL}/admin/courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(data);
                if (data.length > 0) {
                    setEditingCourse({
                        id: data[0]._id,
                        name: data[0].name,
                        systemPrompt: data[0].systemPrompt,
                        welcomeMessage: data[0].welcomeMessage
                    });
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/courses`, editingCourse, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Course updated successfully! AI Mentor prompt updated.');
        } catch (err) {
            alert('Failed to save: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 page-fade-in">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center">
                    Course Management <Sparkles className="ml-3 text-amber-400" size={32} />
                </h1>
                <p className="text-slate-500 mt-1">Configure your AI Mentor's intelligence and initial outreach.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                    <BookOpen size={16} className="mr-2 text-indigo-500" /> Course Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                    value={editingCourse.name}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                    <Brain size={16} className="mr-2 text-indigo-500" /> AI System Prompt (The Brain)
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Define how the AI should behave, teach, and interact with students.</p>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed min-h-[250px]"
                                    value={editingCourse.systemPrompt}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, systemPrompt: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                    <MessageSquare size={16} className="mr-2 text-indigo-500" /> Initial Welcome Message
                                </label>
                                <p className="text-xs text-slate-400 mb-2">The very first message students receive on WhatsApp when they start the course.</p>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                    value={editingCourse.welcomeMessage}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, welcomeMessage: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center space-x-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>Save Intelligence Update</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            Pro Tip
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                            Your "System Prompt" is the most powerful tool here. Use it to set the tone:
                        </p>
                        <ul className="text-xs space-y-2 text-indigo-200">
                            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" /> Set the instructor's personality</li>
                            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" /> Define quiz formats and rules</li>
                            <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" /> Limit response length for WhatsApp</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
