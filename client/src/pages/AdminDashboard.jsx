import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Phone, Mail, UserCheck, Clock, MapPin, Tag, Trash2, X, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [serviceSeekers, setServiceSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/jobs/${deleteTarget._id}`);
            setServiceSeekers(prev => prev.filter(j => j._id !== deleteTarget._id));
            showToast('success', `"${deleteTarget.title}" has been deleted.`);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete job.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!userInfo || !userInfo.token) {
                    navigate('/login');
                    return;
                }

                if (userInfo.role !== 'admin') {
                    navigate('/'); // Redirect non-admins
                    return;
                }

                const [workersRes, jobsRes] = await Promise.all([
                    api.get('/admin/job-seekers'),
                    api.get('/admin/service-seekers')
                ]);

                setJobSeekers(workersRes.data);
                setServiceSeekers(jobsRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading Admin Dashboard...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 ${toast.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-700'}`}>
                    {toast.type === 'success'
                        ? <CheckCircle size={18} className="text-green-500 shrink-0" />
                        : <AlertTriangle size={18} className="text-red-500 shrink-0" />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <Trash2 size={22} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete this job?</h3>
                                <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-sm font-semibold text-gray-800">
                            "{deleteTarget.title}"
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('admin.dashboard')}</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage employees, employer job requests, and connect applicants.</p>
                </div>
                <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                    Admin Portal
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Employees (Job Seekers) Column */}
                <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Users size={20} className="mr-2 text-blue-600" />
                            {t('admin.jobSeekers')} ({jobSeekers.length})
                        </h2>
                    </div>

                    {jobSeekers.length === 0 ? (
                        <p className="text-gray-500 text-sm py-4">{t('admin.noJobSeekers')}</p>
                    ) : (
                        <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                            {jobSeekers.map((worker) => (
                                <div key={worker._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{worker.name || 'Unnamed Worker'}</h3>
                                        <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                            📞 {worker.phone || (worker.socialLinks?.whatsapp && `WA: ${worker.socialLinks.whatsapp}`) || 'No Phone'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3 flex items-center">
                                        <Mail size={12} className="mr-1 text-gray-400" />
                                        {worker.email}
                                    </div>

                                    {worker.skills && worker.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {worker.skills.map((skill, index) => (
                                                <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {worker.bio && (
                                        <p className="text-xs text-gray-600 line-clamp-2 italic bg-white p-2 rounded border border-gray-100">
                                            "{worker.bio}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Service Requests & Applications Column */}
                <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Briefcase size={20} className="mr-2 text-green-600" />
                            {t('admin.serviceRequests')} ({serviceSeekers.length})
                        </h2>
                    </div>

                    {serviceSeekers.length === 0 ? (
                        <p className="text-gray-500 text-sm py-4">{t('admin.noServiceRequests')}</p>
                    ) : (
                        <div className="space-y-6 max-h-[750px] overflow-y-auto pr-1">
                            {serviceSeekers.map((job) => (
                                <div key={job._id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                                    {/* Header / Employer Details */}
                                    <div className="flex flex-wrap justify-between items-start mb-4 gap-3 pb-3 border-b border-gray-100">
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                                                {job.category?.name || 'General'}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                            <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                                                <span className="flex items-center"><MapPin size={12} className="mr-1 text-gray-400" />{job.location}</span>
                                                <span className="font-bold text-green-600">{job.budget?.toLocaleString()} RWF</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right text-xs">
                                            <div className="font-bold text-slate-900 flex items-center justify-end">
                                                <UserCheck size={14} className="mr-1 text-blue-600" />
                                                Employer: {job.client?.name || 'Anonymous'}
                                            </div>
                                            <div className="text-green-700 font-bold mt-1">
                                                📞 {job.phone || job.client?.phone || 'No Phone'}
                                            </div>
                                            {job.client?.email && <div className="text-gray-400 text-[11px] mt-0.5">{job.client.email}</div>}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                                        {job.description}
                                    </p>

                                    {/* Applicants Section */}
                                    <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center">
                                                <Users size={14} className="mr-1.5 text-blue-600" />
                                                Interested Applicants ({job.applicants?.length || 0})
                                            </h4>
                                        </div>

                                        {(!job.applicants || job.applicants.length === 0) ? (
                                            <p className="text-xs text-gray-400 italic">No workers have applied for this job post yet.</p>
                                        ) : (
                                            <div className="space-y-2.5">
                                                {job.applicants.map((app, idx) => {
                                                    const worker = app.worker;
                                                    const applicantName = app.name || worker?.name || 'Applicant';
                                                    const applicantPhone = app.phone || worker?.phone || (worker?.socialLinks?.whatsapp ? `WA: ${worker.socialLinks.whatsapp}` : 'No Phone');
                                                    const applicantSkills = app.skills || app.message || (worker?.skills?.join(', ')) || worker?.bio || '';

                                                    return (
                                                        <div key={app._id || idx} className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-2xs">
                                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                                <div>
                                                                    <span className="font-bold text-gray-900">{applicantName}</span>
                                                                    {worker?.email && <span className="text-gray-400 text-[11px] ml-2">({worker.email})</span>}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded font-bold text-xs flex items-center">
                                                                        📞 {applicantPhone}
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-400 flex items-center">
                                                                        <Clock size={10} className="mr-1" />
                                                                        {new Date(app.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {applicantSkills && (
                                                                <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                                                                    <span className="font-semibold text-gray-700">Skills / Description: </span>
                                                                    {applicantSkills}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Delete Button */}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => setDeleteTarget(job)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition border border-red-100 hover:border-red-200"
                                        >
                                            <Trash2 size={14} /> Delete Job
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
