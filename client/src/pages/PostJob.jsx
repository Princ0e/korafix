import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Briefcase, MapPin, DollarSign, FileText, List, ArrowRight, User, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostJob = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        phone: '',
        budget: ''
    });
    const [categories, setCategories] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loadingWorkers, setLoadingWorkers] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, workerRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/users')
                ]);
                setCategories(catRes.data);
                setWorkers(workerRes.data.slice(0, 3)); // Show top 3
            } catch (err) {
                console.error('Error fetching data:', err);
                // Removed setError(t('postJob.error')) here so it doesn't show by default if fetching fails
            } finally {
                setLoadingWorkers(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.post('/jobs', { ...formData });
            alert(t('postJob.success'));
            navigate('/dashboard');
        } catch (err) {
            console.error('Error posting job:', err);
            const serverMessage = err.response?.data?.message;
            const axiosMessage = err.message;
            const detailedError = serverMessage ? `${serverMessage}` : (axiosMessage || t('postJob.error'));
            setError(detailedError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-8 py-6 text-white text-center">
                    <h1 className="text-3xl font-bold">{t('postJob.title')}</h1>
                    <p className="text-blue-100 mt-2">{t('postJob.subtitle')}</p>
                </div>

                <div className="p-8">
                    {/* Browse Workers Hint */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-blue-600 p-2 rounded-lg text-white mr-4">
                                <List size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 text-sm">Need a specific professional?</h3>
                                <p className="text-blue-700 text-xs mt-0.5">Browse through our community of skilled experts.</p>
                            </div>
                        </div>
                        <Link to="/workers" className="text-blue-600 font-bold text-sm hover:underline flex items-center">
                            Browse Workers <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <Briefcase size={18} className="mr-2 text-blue-600" />
                                {t('postJob.jobTitle')}
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <List size={18} className="mr-2 text-blue-600" />
                                {t('postJob.category')}
                            </label>
                            <select
                                name="category"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">{t('postJob.selectCategory')}</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <FileText size={18} className="mr-2 text-blue-600" />
                                {t('postJob.description')}
                            </label>
                            <textarea
                                name="description"
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <MapPin size={18} className="mr-2 text-blue-600" />
                                {t('postJob.location')}
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <Briefcase size={18} className="mr-2 text-blue-600" />
                                {t('postJob.phone')}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <DollarSign size={18} className="mr-2 text-blue-600" />
                                {t('postJob.budget')}
                            </label>
                            <input
                                type="number"
                                name="budget"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Posting...' : t('postJob.submit')}
                        </button>
                    </form>

                    {/* Featured Workers Preview */}
                    {!loadingWorkers && workers.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Star size={20} className="mr-2 text-yellow-500 fill-yellow-500" />
                                Community Experts Ready to Help
                            </h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                {workers.map(worker => (
                                    <div key={worker._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group">
                                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <User size={20} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{worker.name || 'Professional'}</h4>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {worker.skills?.slice(0, 2).map((skill, i) => (
                                                <span key={i} className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-xs line-clamp-2 italic mb-4">
                                            "{worker.bio || 'Available for professional services in Rwanda.'}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <Link to="/workers" className="inline-flex items-center text-blue-600 font-bold text-sm hover:underline">
                                    View all professionals <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostJob;
