import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { MapPin, Calendar, Briefcase, Star, ArrowRight, CheckCircle, AlertCircle, X, User, Phone, FileText, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const renderLocation = (loc) => {
    if (!loc) return 'Rwanda';
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') return loc.city || loc.address || 'Rwanda';
    return String(loc);
};

const renderCategory = (cat) => {
    if (!cat) return 'General';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object' && cat.name) return cat.name;
    return 'General';
};

const Jobs = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Application modal state
    const [applyJobTarget, setApplyJobTarget] = useState(null);
    const [applyForm, setApplyForm] = useState({ name: '', phone: '', skills: '' });
    const [submittingApp, setSubmittingApp] = useState(false);
    const [formError, setFormError] = useState('');
    
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [modal, setModal] = useState(null); // { type: 'success'|'info'|'error', title, message }

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const titleParam = searchParams.get('title');
                const locationParam = searchParams.get('location');
                const categoryParam = searchParams.get('category');

                const { data } = await api.get('/jobs', {
                    params: {
                        title: titleParam || undefined,
                        location: locationParam || undefined,
                        category: categoryParam || undefined
                    }
                });
                setJobs(data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [location.search]);

    const openApplyModal = (job) => {
        try {
            console.log('Opening apply modal for job:', job);
            setApplyJobTarget(job);
            setFormError('');
            setApplyForm({
                name: user?.name || '',
                phone: user?.phone || user?.socialLinks?.whatsapp || '',
                skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.bio || '')
            });
            document.body.style.overflow = 'hidden';
        } catch (err) {
            console.error('Error opening apply modal:', err);
        }
    };

    const closeApplyModal = () => {
        setApplyJobTarget(null);
        document.body.style.overflow = 'unset';
    };

    const closeModal = () => {
        setModal(null);
        document.body.style.overflow = 'unset';
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!applyForm.name.trim() || !applyForm.phone.trim() || !applyForm.skills.trim()) {
            setFormError('Please fill in your name, phone number, and description of your skills.');
            return;
        }

        setSubmittingApp(true);
        setFormError('');

        try {
            const targetId = applyJobTarget._id;
            const targetTitle = applyJobTarget.title;

            const { data } = await api.post(`/jobs/${targetId}/apply`, applyForm);

            setAppliedJobs(prev => [...prev, targetId]);
            closeApplyModal();
            
            document.body.style.overflow = 'hidden';
            setModal({
                type: 'success',
                title: 'Application Sent Successfully!',
                message: data.message || `Your application for "${targetTitle}" has been submitted to the employer and notified to the admin. KoraFix admin will contact you shortly!`
            });
        } catch (err) {
            console.error('Submit application error:', err);
            const msg = err.response?.data?.message || 'Failed to send application. Please try again.';
            if (msg.toLowerCase().includes('already applied')) {
                if (applyJobTarget?._id) setAppliedJobs(prev => [...prev, applyJobTarget._id]);
                closeApplyModal();
                document.body.style.overflow = 'hidden';
                setModal({
                    type: 'info',
                    title: 'Already Applied',
                    message: 'You have already applied for this job. The admin will connect you with the employer soon.'
                });
            } else {
                setFormError(msg);
            }
        } finally {
            setSubmittingApp(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading jobs...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {/* Interactive Application Form Modal */}
            {applyJobTarget && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto w-screen h-screen top-0 left-0">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-auto">
                        <button
                            type="button"
                            onClick={closeApplyModal}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                Job Application
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{applyJobTarget.title}</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {renderLocation(applyJobTarget.location)} • Budget: <span className="font-semibold text-green-600">{applyJobTarget.budget ? (typeof applyJobTarget.budget === 'number' ? applyJobTarget.budget.toLocaleString() : applyJobTarget.budget) : 'N/A'} RWF</span>
                            </p>
                        </div>

                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-xs font-semibold flex items-center">
                                <AlertCircle size={16} className="mr-2 shrink-0 text-red-500" />
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center">
                                    <User size={14} className="mr-1.5 text-blue-600" />
                                    Your Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. John Mugisha"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 text-sm outline-none"
                                    value={applyForm.name}
                                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center">
                                    <Phone size={14} className="mr-1.5 text-green-600" />
                                    Your Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="e.g. 0780000000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 text-sm outline-none"
                                    value={applyForm.phone}
                                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                                />
                            </div>

                            {/* Skills / Experience Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center">
                                    <FileText size={14} className="mr-1.5 text-purple-600" />
                                    Description of Your Skills & Experience *
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Describe your qualifications, skills, or experience for this job..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 text-sm resize-none outline-none"
                                    value={applyForm.skills}
                                    onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeApplyModal}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingApp}
                                    className={`flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition text-sm flex items-center justify-center cursor-pointer ${submittingApp ? 'opacity-50 cursor-wait' : ''}`}
                                >
                                    <Send size={16} className="mr-2" />
                                    {submittingApp ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Application Feedback Modal */}
            {modal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto w-screen h-screen top-0 left-0">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative text-center my-auto">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
                            modal.type === 'success' ? 'bg-green-100 text-green-600' :
                            modal.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                        }`}>
                            {modal.type === 'success' || modal.type === 'info' ? (
                                <CheckCircle size={36} />
                            ) : (
                                <AlertCircle size={36} />
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{modal.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{modal.message}</p>

                        <button
                            type="button"
                            onClick={closeModal}
                            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}

            {/* Worker CTA Section */}
            <div className="mb-16 bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase size={120} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-bold mb-6 border border-blue-500/30">
                        <Star size={16} className="mr-2" />
                        {t('jobs.workerCTA.title')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                        {t('jobs.workerCTA.subtitle')}
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate(user ? '/worker-info' : '/login?redirect=/worker-info')}
                        className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 group shadow-lg cursor-pointer"
                    >
                        {t('jobs.workerCTA.button')}
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t('jobs.title')}</h1>
                <p className="text-lg text-gray-500">{t('jobs.subtitle')}</p>
                {new URLSearchParams(location.search).get('category') && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                            <span>📂</span>
                            {new URLSearchParams(location.search).get('category')}
                            <button
                                type="button"
                                onClick={() => navigate('/jobs')}
                                className="ml-1 text-blue-400 hover:text-blue-700 transition cursor-pointer font-bold"
                                title="Clear filter"
                            >✕</button>
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/jobs')}
                            className="text-sm text-gray-400 hover:text-blue-600 underline transition"
                        >
                            View all jobs
                        </button>
                    </div>
                )}
            </div>


            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{t('jobs.noJobs')}</h3>
                    <p className="text-gray-500 mt-2">{t('jobs.checkBack')}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => {
                        const isApplied = appliedJobs.includes(job._id) || (
                            user && user._id ? (
                                Array.isArray(job.applicants) && job.applicants.some(a => {
                                    const workerId = a?.worker?._id || a?.worker;
                                    return workerId && String(workerId) === String(user._id);
                                })
                            ) : false
                        );

                        return (
                            <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                                            {renderCategory(job.category)}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                    </div>
                                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">
                                        {job.budget ? (typeof job.budget === 'number' ? job.budget.toLocaleString() : job.budget) : 'N/A'} RWF
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                                    {job.description}
                                </p>

                                <div className="border-t border-gray-50 pt-4 mt-auto space-y-3">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin size={16} className="mr-2 text-gray-400" />
                                        {renderLocation(job.location)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {t('jobs.posted')} {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openApplyModal(job);
                                    }}
                                    disabled={isApplied}
                                    className={`mt-6 w-full font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center cursor-pointer ${
                                        isApplied
                                            ? 'bg-green-600 text-white cursor-default'
                                            : 'bg-slate-900 hover:bg-black text-white shadow-md active:scale-95'
                                    }`}
                                >
                                    {isApplied ? (
                                        <>
                                            <CheckCircle size={18} className="mr-2" />
                                            Application Sent ✓
                                        </>
                                    ) : (
                                        t('jobs.applyExclamation')
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Jobs;
