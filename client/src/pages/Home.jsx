import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Shield, Star, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="font-sans">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/logo.jpg"
                        alt="Diverse Team Working"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply backdrop-blur-[1px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md">
                        {t('home.heroTitle')} <span className="text-blue-600 bg-white/20 px-2 rounded-lg backdrop-blur-sm">{t('home.heroProfessional')}</span> <br className="hidden md:block" /> {t('home.heroSubtitle')}
                    </h1>
                    <p className="text-xl text-blue-50 max-w-3xl mx-auto mb-10 font-light drop-shadow">
                        {t('home.heroDesc')}
                    </p>

                    {/* Search Bar with Glassmorphism */}
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/30 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 flex items-center bg-white rounded-xl px-5 py-4 shadow-sm">
                            <Search className="text-blue-600 mr-3" size={22} />
                            <input type="text" placeholder={t('home.searchPlaceholder')} className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium" />
                        </div>
                        <div className="flex-1 flex items-center bg-white rounded-xl px-5 py-4 shadow-sm border-t md:border-t-0 md:border-l border-gray-100">
                            <MapPin className="text-emerald-500 mr-3" size={22} />
                            <input type="text" placeholder={t('home.locationPlaceholder')} className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium" />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center">
                            {t('home.searchButton')} <ArrowRight className="ml-2" size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats / Trust Section */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: t('home.stats.verified'), desc: t('home.stats.verifiedDesc'), color: "text-blue-600", bg: "bg-blue-50" },
                            { icon: Star, title: t('home.stats.quality'), desc: t('home.stats.qualityDesc'), color: "text-yellow-600", bg: "bg-yellow-50" },
                            { icon: Users, title: t('home.stats.matching'), desc: t('home.stats.matchingDesc'), color: "text-purple-600", bg: "bg-purple-50" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className={`h-16 w-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mr-6 shrink-0`}>
                                    <item.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-gray-500 font-medium text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('home.categoriesTitle')}</h2>
                            <p className="text-gray-500 text-lg">{t('home.categoriesDesc')}</p>
                        </div>
                        <Link to="/categories" className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-700 transition">{t('home.viewAll')} <ArrowRight size={20} className="ml-2" /></Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['homeServices', 'tech', 'creative', 'construction', 'mechanical', 'office', 'health', 'education'].map((catKey, idx) => (
                            <Link to="/categories" key={idx} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200 transform hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Star size={64} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition relative z-10">{t(`categories.${catKey}`)}</h3>
                                <p className="text-sm text-gray-400 mt-2 font-medium group-hover:text-gray-500 transition relative z-10">{t('home.viewProfessionals')}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 md:hidden text-center">
                        <Link to="/categories" className="inline-flex items-center text-blue-600 font-bold">{t('home.viewAll')} <ArrowRight size={20} className="ml-2" /></Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6">{t('home.ctaTitle')}</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{t('home.ctaDesc')}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-300 shadow-lg">{t('home.getStarted')}</Link>
                        <Link to="/jobs" className="bg-transparent border-2 border-gray-600 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-300">{t('home.browseJobs')}</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
