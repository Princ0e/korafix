import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { isAdminUser } from '../utils/auth';
import api from '../api/axios';
import { Briefcase, Search, User, MapPin, Trash2, Plus, AlertTriangle, X, CheckCircle, Shield, ExternalLink, Users } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // job to confirm deletion
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

    const isAdmin = isAdminUser(user);

    useEffect(() => {
        if (!user) return;
        const fetchJobs = async () => {
            setLoadingJobs(true);
            try {
                if (isAdmin) {
                    try {
                        const { data } = await api.get('/admin/service-seekers');
                        setJobs(data);
                    } catch {
                        const { data } = await api.get('/jobs');
                        setJobs(data);
                    }
                } else {
                    const { data } = await api.get('/jobs/my-jobs');
                    setJobs(data);
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, [user, isAdmin]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/jobs/${deleteTarget._id}`);
            setJobs(prev => prev.filter(j => j._id !== deleteTarget._id));
            showToast('success', `"${deleteTarget.title}" has been deleted.`);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete job.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in Required</h2>
                <p className="text-gray-500 text-sm mb-6">Please log in to view your dashboard.</p>
                <Link
                    to="/login?redirect=/dashboard"
                    className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
                >
                    Log In
                </Link>
            </div>
        );
    }

    const statusColors = {
        'Open': 'bg-green-50 text-green-700 border-green-200',
        'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
        'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'Completed': 'bg-gray-100 text-gray-600 border-gray-200',
        'Cancelled': 'bg-red-50 text-red-600 border-red-200',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Toast notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 ${toast.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-700'}`}>
                    {toast.type === 'success'
                        ? <CheckCircle size={18} className="text-green-500 shrink-0" />
                        : <AlertTriangle size={18} className="text-red-500 shrink-0" />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
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

            {/* Administrator Top Banner */}
            {isAdmin && (
                <div className="mb-8 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-white">Administrator Access Active</h3>
                            <p className="text-red-100 text-sm mt-0.5">
                                You have master control to review all workers, platform jobs, and connected applicants.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 font-black px-5 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                    >
                        Open Admin Panel <ExternalLink size={16} />
                    </Link>
                </div>
            )}

            {/* Profile card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome', { name: user.name })}</h1>
                        <p className="text-gray-500 mt-1 font-medium">
                            {isAdmin ? '👑 Administrator' :
                                user.role === 'client' ? t('auth.clientRole') :
                                    user.role === 'worker' ? t('auth.workerRole') :
                                        user.role} {t('dashboard.accountType', { role: '' }).trim()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Link to="/categories" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                    <div className="bg-indigo-50 p-3 rounded-lg w-fit text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Search size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{t('dashboard.detailedCategories')}</h3>
                    <p className="text-gray-500 text-sm">{t('dashboard.browseCategoriesDesc')}</p>
                </Link>

                {(user.role === 'client' || isAdmin) && (
                    <Link to="/hire" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="bg-blue-50 p-3 rounded-lg w-fit text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{t('dashboard.postJob')}</h3>
                        <p className="text-gray-500 text-sm">{t('dashboard.postJobDesc')}</p>
                    </Link>
                )}

                {isAdmin && (
                    <Link to="/admin" className="bg-white p-6 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition group bg-gradient-to-br from-red-50/50 to-white">
                        <div className="bg-red-100 p-3 rounded-lg w-fit text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition">
                            <Shield size={24} />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">Admin Panel</h3>
                            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Master</span>
                        </div>
                        <p className="text-gray-500 text-sm">Review job applicants, workers, and platform operations.</p>
                    </Link>
                )}
            </div>

            {/* Jobs Section */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isAdmin ? `All Platform Posted Jobs (${jobs.length})` : 'My Posted Jobs'}
                        </h2>
                        {isAdmin && (
                            <p className="text-gray-500 text-xs mt-1">
                                Showing all jobs posted across the platform. Click details to view full worker contact details.
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-red-200 transition"
                            >
                                <Users size={14} /> Full Applicant Details →
                            </Link>
                        )}
                        <Link
                            to="/hire"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
                        >
                            <Plus size={16} /> Post New Job
                        </Link>
                    </div>
                </div>

                {loadingJobs ? (
                    <div className="text-center py-16 text-gray-400 font-medium">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                        <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No jobs posted yet.</p>
                        <Link to="/hire" className="inline-block mt-4 text-blue-600 font-bold text-sm hover:underline">
                            Post a job →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                                <div className="p-5 flex-grow">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[job.status] || statusColors['Open']}`}>
                                            {job.status}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{job.title}</h3>
                                    {job.category?.name && (
                                        <span className="inline-block text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded mb-2">
                                            {job.category.name}
                                        </span>
                                    )}
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{job.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        {job.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} /> {job.location}
                                            </span>
                                        )}
                                        {job.budget && (
                                            <span className="font-semibold text-green-600">
                                                {Number(job.budget).toLocaleString()} RWF
                                            </span>
                                        )}
                                    </div>
                                    {isAdmin && job.client?.name && (
                                        <div className="mt-3 pt-2 border-t border-gray-50 text-xs text-gray-400">
                                            Employer: <span className="font-semibold text-gray-700">{job.client.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                                        {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition"
                                            >
                                                Details
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => setDeleteTarget(job)}
                                            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
