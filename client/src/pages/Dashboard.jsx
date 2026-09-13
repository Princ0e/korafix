import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Briefcase, Search, User, MapPin, Trash2, Plus, AlertTriangle, X, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [myJobs, setMyJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // job to confirm deletion
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

    useEffect(() => {
        if (!user) return;
        const fetchMyJobs = async () => {
            setLoadingJobs(true);
            try {
                const { data } = await api.get('/jobs/my-jobs');
                setMyJobs(data);
            } catch (err) {
                console.error('Error fetching my jobs:', err);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchMyJobs();
    }, [user]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/jobs/${deleteTarget._id}`);
            setMyJobs(prev => prev.filter(j => j._id !== deleteTarget._id));
            showToast('success', `"${deleteTarget.title}" has been deleted.`);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete job.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your dashboard.</div>;
    }

    const statusColors = {
        'Open': 'bg-green-50 text-green-700 border-green-200',
        'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
        'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'Completed': 'bg-gray-100 text-gray-600 border-gray-200',
        'Cancelled': 'bg-red-50 text-red-600 border-red-200',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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

            {/* Profile card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome', { name: user.name })}</h1>
                        <p className="text-gray-500 mt-1">
                            {user.role === 'admin' ? t('navbar.adminPanel') :
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

                {user.role === 'client' && (
                    <Link to="/hire" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <div className="bg-blue-50 p-3 rounded-lg w-fit text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{t('dashboard.postJob')}</h3>
                        <p className="text-gray-500 text-sm">{t('dashboard.postJobDesc')}</p>
                    </Link>
                )}
            </div>

            {/* My Posted Jobs — visible to anyone who has posted jobs */}
            {(loadingJobs || myJobs.length > 0) && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Posted Jobs</h2>
                        <Link
                            to="/hire"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
                        >
                            <Plus size={16} /> Post New Job
                        </Link>
                    </div>

                    {loadingJobs ? (
                        <div className="text-center py-16 text-gray-400 font-medium">Loading your jobs...</div>
                    ) : myJobs.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
                            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">You haven't posted any jobs yet.</p>
                            <Link to="/hire" className="inline-block mt-4 text-blue-600 font-bold text-sm hover:underline">
                                Post your first job →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myJobs.map(job => (
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
                                    </div>
                                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                                        </span>
                                        <button
                                            onClick={() => setDeleteTarget(job)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
