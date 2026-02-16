import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, Book, CheckCircle2, MoreVertical, Loader2, Send } from 'lucide-react';
import API_BASE_URL from '../config';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [studentRes, courseRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/admin/courses`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStudents(studentRes.data);
                setCourses(courseRes.data);
                if (courseRes.data.length > 0) setSelectedCourse(courseRes.data[0]._id);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStartTeaching = async (userId) => {
        if (!selectedCourse) return alert('Please select a course first');

        setActionLoading(userId);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/send-welcome`, {
                userId,
                courseId: selectedCourse
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert('Welcome message sent successfully!');
            // Refresh student list to show updated course
            const { data } = await axios.get(`${API_BASE_URL}/admin/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(data);
        } catch (err) {
            alert('Failed to send message: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Students</h1>
                    <p className="text-slate-500 mt-1">Manage enrollments and monitor progress.</p>
                </div>

                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 px-2">ACTIVE COURSE:</span>
                    <select
                        className="bg-slate-50 border-none text-sm font-semibold text-indigo-600 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Contact</th>
                            <th>Current Module</th>
                            <th>Progress</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 px-2">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-slate-400 italic">No students found yet.</td>
                            </tr>
                        ) : students.map((student) => (
                            <tr key={student._id}>
                                <td>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-bold text-slate-900">{student.name}</div>
                                            <div className="text-xs text-slate-400">ID: ...{student._id.slice(-6)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center text-slate-500">
                                        <Phone size={14} className="mr-1.5" />
                                        {student.phoneNumber}
                                    </div>
                                </td>
                                <td>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 flex items-center w-fit">
                                        <Book size={12} className="mr-1.5" />
                                        {student.currentModule}
                                    </span>
                                </td>
                                <td>
                                    <div className="w-40">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400">COMPLETION</span>
                                            <span className="text-[10px] font-bold text-indigo-600">{student.progress.length * 10}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                style={{ width: `${student.progress.length * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => handleStartTeaching(student._id)}
                                        disabled={actionLoading === student._id}
                                        className="inline-flex items-center p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm disabled:opacity-50"
                                        title="Send Welcome Message"
                                    >
                                        {actionLoading === student._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-1" />
                                                <span>Start Teaching</span>
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Students;
