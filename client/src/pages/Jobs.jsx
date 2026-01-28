import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Jobs = () => {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading jobs...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t('jobs.title')}</h1>
                <p className="text-lg text-gray-500">{t('jobs.subtitle')}</p>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{t('jobs.noJobs')}</h3>
                    <p className="text-gray-500 mt-2">{t('jobs.checkBack')}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                                        {job.category?.name || 'General'}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                </div>
                                <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">
                                    {job.budget?.toLocaleString()} RWF
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                                {job.description}
                            </p>

                            <div className="border-t border-gray-50 pt-4 mt-auto space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                    {job.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    {t('jobs.posted')} {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <button className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition duration-200">
                                {t('jobs.applyExclamation')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;
