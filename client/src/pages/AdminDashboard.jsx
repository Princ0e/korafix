import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [serviceSeekers, setServiceSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const workersRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/job-seekers`, config);
                const jobsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/service-seekers`, config);

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

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{t('admin.dashboard')}</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Job Seekers (Workers) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('admin.jobSeekers')}</h2>
                    {jobSeekers.length === 0 ? (
                        <p className="text-gray-500">{t('admin.noJobSeekers')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-gray-600">{t('admin.name')}</th>
                                        <th className="py-2 text-gray-600">{t('admin.phone')}</th>
                                        <th className="py-2 text-gray-600">Skills</th>
                                        <th className="py-2 text-gray-600">Bio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobSeekers.map((worker) => (
                                        <tr key={worker._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 font-medium">{worker.name || 'Unnamed'}</td>
                                            <td className="py-2">
                                                <div className="font-medium text-gray-800">
                                                    {worker.phone || (worker.socialLinks?.whatsapp && `WA: ${worker.socialLinks.whatsapp}`) || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-400">{worker.email}</div>
                                            </td>
                                            <td className="py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {worker.skills && worker.skills.length > 0 ? (
                                                        worker.skills.map((skill, index) => (
                                                            <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No skills</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2 text-xs text-gray-500 max-w-xs truncate" title={worker.bio}>
                                                {worker.bio || 'No bio'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Service Seekers (Jobs) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">{t('admin.serviceRequests')}</h2>
                    {serviceSeekers.length === 0 ? (
                        <p className="text-gray-500">{t('admin.noServiceRequests')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-gray-600">{t('admin.jobService')}</th>
                                        <th className="py-2 text-gray-600">{t('admin.clientName')}</th>
                                        <th className="py-2 text-gray-600">{t('admin.phone')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceSeekers.map((job) => (
                                        <tr key={job._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 font-medium">{job.title}</td>
                                            <td className="py-2 text-sm text-gray-500">{job.client?.name || 'Anonymous'}</td>
                                            <td className="py-2">{job.phone || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
