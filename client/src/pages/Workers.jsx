import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { User, MapPin, Search, X, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';

const Workers = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Hire modal state
    const [hireTarget, setHireTarget] = useState(null); // the worker being hired
    const [hireForm, setHireForm] = useState({ title: '', description: '', budget: '', location: '' });
    const [hiring, setHiring] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const { data } = await api.get('/users');
                setWorkers(data);
            } catch (err) {
                console.error('Error fetching workers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkers();
    }, []);

    const filteredWorkers = workers.filter(w =>
        (w.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        w.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        (w.bio?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const openHireModal = (worker) => {
        if (!user) {
            navigate('/login?redirect=/workers');
            return;
        }
        setHireTarget(worker);
        setHireForm({ title: '', description: '', budget: '', location: '' });
    };

    const closeHireModal = () => {
        setHireTarget(null);
        setHireForm({ title: '', description: '', budget: '', location: '' });
    };

    const handleHireSubmit = async (e) => {
        e.preventDefault();
        if (!hireForm.title.trim() || !hireForm.description.trim()) return;
        setHiring(true);
        try {
            await api.post('/hire', {
                workerId: hireTarget._id,
                title: hireForm.title.trim(),
                description: hireForm.description.trim(),
                budget: hireForm.budget ? Number(hireForm.budget) : undefined,
                location: hireForm.location.trim() || undefined
            });
            closeHireModal();
            showToast('success', `Hire request sent to ${hireTarget.name}! Check your dashboard for updates.`);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to send hire request. Please try again.');
        } finally {
            setHiring(false);
        }
    };

    const isClient = user?.role === 'client';
    const isAdmin = user?.role === 'admin';
    const canHire = isClient || isAdmin;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-semibold ${toast.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-700'}`}>
                    {toast.type === 'success'
                        ? <CheckCircle size={18} className="text-green-500 shrink-0" />
                        : <AlertTriangle size={18} className="text-red-500 shrink-0" />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
            )}

            {/* Hire Modal */}
            {hireTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Hire {hireTarget.name}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Describe the job you need done</p>
                            </div>
                            <button onClick={closeHireModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Worker mini-preview */}
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{hireTarget.name}</p>
                                <p className="text-xs text-gray-500">{hireTarget.skills?.join(', ') || 'Professional'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleHireSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fix leaking pipe in bathroom"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    value={hireForm.title}
                                    onChange={e => setHireForm(f => ({ ...f, title: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe the work you need done, any specific requirements..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    value={hireForm.description}
                                    onChange={e => setHireForm(f => ({ ...f, description: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Budget (RWF)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 20000"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={hireForm.budget}
                                        onChange={e => setHireForm(f => ({ ...f, budget: e.target.value }))}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Kigali, Remera"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        value={hireForm.location}
                                        onChange={e => setHireForm(f => ({ ...f, location: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeHireModal}
                                    disabled={hiring}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={hiring || !hireForm.title.trim() || !hireForm.description.trim()}
                                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {hiring ? 'Sending...' : (<><Briefcase size={15} /> Send Hire Request</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Page header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Skilled Professionals</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Discover and connect with experts across Rwanda. Quality service for every need.
                </p>

                <div className="mt-8 max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by skill, name or profession..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading experts...</div>
            ) : filteredWorkers.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <User size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No experts found</h3>
                    <p className="text-gray-500 mt-2">Try searching for a different skill or name.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWorkers.map((worker) => (
                        <div key={worker._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                            <div className="h-2 bg-blue-600"></div>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{worker.name}</h3>
                                        {worker.location?.city && (
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin size={14} className="mr-1" />
                                                {worker.location.city}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {worker.skills && worker.skills.length > 0 ? (
                                            worker.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No skills listed yet</span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                    {worker.bio || "This professional hasn't added a bio yet, but they are ready to help with your project!"}
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                                <div className="text-xs font-bold bg-blue-50/80 text-blue-800 px-3 py-1.5 rounded-lg flex items-center border border-blue-100">
                                    Available
                                </div>

                                {canHire ? (
                                    <button
                                        onClick={() => openHireModal(worker)}
                                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition shadow-sm"
                                    >
                                        <Briefcase size={14} /> Hire
                                    </button>
                                ) : user?.role === 'worker' ? (
                                    <span className="text-xs text-gray-400 italic">Switch to employer to hire</span>
                                ) : (
                                    <Link
                                        to="/login?redirect=/workers"
                                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition shadow-sm"
                                    >
                                        <Briefcase size={14} /> Hire
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workers;
