import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Briefcase, MapPin, DollarSign, FileText, List } from 'lucide-react';

const PostJob = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        phone: '',
        budget: ''
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', { ...formData, postedBy: user._id });
            alert(t('postJob.success'));
            navigate('/dashboard');
        } catch (err) {
            console.error('Error posting job:', err);
            setError(t('postJob.error'));
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {t('postJob.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
