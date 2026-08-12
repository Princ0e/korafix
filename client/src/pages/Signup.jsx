import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, Briefcase } from 'lucide-react';

const Signup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { signup } = useContext(AuthContext);
    const [error, setError] = useState('');
    const redirect = new URLSearchParams(location.search).get('redirect');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: redirect === '/worker-info' ? 'worker' : 'client'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await signup(formData);
        if (res.success) {
            navigate(redirect || '/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{t('auth.createAccountTitle')}</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('auth.haveAccount')} <Link to="/login" className="font-medium text-secondary hover:text-blue-500">{t('auth.signInLink')}</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm">{error}</div>}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('auth.fullName')}</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('auth.emailLabel')}</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('auth.passwordLabel')}</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="focus:ring-secondary focus:border-secondary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.iAmA')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'client' })}
                                    className={`flex justify-center items-center py-3 border rounded-md text-sm font-medium ${formData.role === 'client' ? 'ring-2 ring-secondary border-secondary bg-blue-50 text-secondary' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                                >
                                    <User size={16} className="mr-2" /> {t('auth.clientRole')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                                    className={`flex justify-center items-center py-3 border rounded-md text-sm font-medium ${formData.role === 'worker' ? 'ring-2 ring-secondary border-secondary bg-blue-50 text-secondary' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                                >
                                    <Briefcase size={16} className="mr-2" /> {t('auth.workerRole')}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                            >
                                {t('auth.createAccountButton')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
