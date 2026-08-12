import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { User, Briefcase, MessageSquare, MapPin, Save } from 'lucide-react';

const WorkerInfo = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading: authLoading, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        skills: '',
        bio: '',
        phone: '',
        location: { city: '' },
        socialLinks: { whatsapp: '' }
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login?redirect=/worker-info');
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setFormData({
                    skills: data.skills?.join(', ') || '',
                    bio: data.bio || '',
                    phone: data.phone || '',
                    location: { city: data.location?.city || '' },
                    socialLinks: { whatsapp: data.socialLinks?.whatsapp || '' }
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        if (user) fetchProfile();
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setFormData({ ...formData, location: { ...formData.location, city: value } });
        } else if (name === 'whatsapp') {
            setFormData({ ...formData, socialLinks: { ...formData.socialLinks, whatsapp: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            const { data } = await api.put('/users/profile', {
                ...formData,
                skills: skillsArray,
                role: 'worker'
            });

            // Update global user state
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));

            setSuccess(t('workerInfo.success'));
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || t('workerInfo.error'));
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-8 py-8 text-white relative">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">{t('workerInfo.title')}</h1>
                        <p className="text-slate-300 mt-2">{t('workerInfo.subtitle')}</p>
                    </div>
                </div>

                <div className="p-8">
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                        <span className="font-bold mr-2">!</span> {error}
                    </div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                        <span className="font-bold mr-2">✓</span> {success}
                    </div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center">
                                <Briefcase size={18} className="mr-2 text-blue-600" />
                                {t('workerInfo.skills')}
                            </label>
                            <input
                                type="text"
                                name="skills"
                                placeholder={t('workerInfo.skillsPlaceholder')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                                value={formData.skills}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center">
                                <User size={18} className="mr-2 text-blue-600" />
                                {t('workerInfo.bio')}
                            </label>
                            <textarea
                                name="bio"
                                rows="4"
                                placeholder={t('workerInfo.bioPlaceholder')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 resize-none"
                                value={formData.bio}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center">
                                    <MessageSquare size={18} className="mr-2 text-green-500" />
                                    {t('workerInfo.phone') || 'Phone Number'}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="e.g. 0780000000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center">
                                    <MessageSquare size={18} className="mr-2 text-green-500" />
                                    {t('workerInfo.whatsapp')}
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    placeholder="e.g. 0780000000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                                    value={formData.socialLinks.whatsapp}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center">
                                    <MapPin size={18} className="mr-2 text-red-500" />
                                    {t('postJob.location')}
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="e.g. Kigali, Musanze"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full flex items-center justify-center bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Save size={20} className="mr-2" />
                            {submitting ? 'Saving...' : t('workerInfo.save')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WorkerInfo;
