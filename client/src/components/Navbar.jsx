import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { t, i18n } = useTranslation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        let newLang;
        if (currentLang === 'en') newLang = 'rw';
        else if (currentLang === 'rw') newLang = 'fr';
        else newLang = 'en';

        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg group-hover:rotate-3 transition-transform">
                                <span className="font-bold text-xl">K</span>
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Kora<span className="text-blue-600">Fix</span></span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/jobs" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-semibold">{t('navbar.findWork')}</Link>
                        <Link to="/hire" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-semibold">{t('navbar.hireTalent')}</Link>
                        <Link to="/categories" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition px-4 py-2 rounded-lg text-sm font-semibold">{t('navbar.categories')}</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-700 transition w-12 text-center"
                        >
                            {i18n.language === 'en' ? 'RW' : i18n.language === 'rw' ? 'FR' : 'EN'}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 rounded-lg">{t('navbar.adminPanel')}</Link>
                                )}
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">{t('navbar.dashboard')}</Link>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 flex items-center justify-center text-white shadow-md cursor-pointer hover:shadow-lg transition" title={user.name}>
                                    <User size={20} />
                                </div>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium">{t('navbar.logout')}</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 mr-2">{t('navbar.adminLogin')}</Link>
                                <Link to="/login" className="text-gray-600 hover:text-primary font-semibold px-4">{t('navbar.login')}</Link>
                                <Link to="/signup" className="bg-slate-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">{t('navbar.signup')}</Link>
                            </>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={toggleMenu} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">{t('navbar.findWork')}</Link>
                        <Link to="/hire" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">{t('navbar.hireTalent')}</Link>
                        <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">{t('navbar.categories')}</Link>

                        <div className="px-3 py-2">
                            <button
                                onClick={toggleLanguage}
                                className="w-full text-left px-3 py-2 rounded-md bg-gray-50 text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                {i18n.language === 'en' ? 'Hindura ururimi: Ikinyarwanda' : i18n.language === 'rw' ? 'Changer de langue: Français' : 'Switch Language: English'}
                            </button>
                        </div>

                        <div className="border-t border-gray-200 mt-4 pt-4">
                            {user ? (
                                <>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">{t('navbar.adminPanel')}</Link>
                                    )}
                                    <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">{t('navbar.dashboard')}</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500">{t('navbar.logout')}</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500">{t('navbar.adminLogin')}</Link>
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">{t('navbar.login')}</Link>
                                    <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">{t('navbar.signup')}</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
