import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { Briefcase, Search, User } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your dashboard.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome', { name: user.name })}</h1>
                        <p className="text-gray-500 mt-1 capitalize">{t('dashboard.accountType', { role: user.role })}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.quickActions')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
    );
};

export default Dashboard;
