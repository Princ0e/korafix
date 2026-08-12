import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Search, MapPin, Shield, Star, Users, ArrowRight } from 'lucide-react';

const socialLinks = [
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/korafiks',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
        hoverColor: 'hover:text-pink-500',
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@korafiks',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
            </svg>
        ),
        hoverColor: 'hover:text-black',
    },
    {
        name: 'X',
        url: 'https://x.com/quickfixer70?s=11',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        hoverColor: 'hover:text-blue-400',
    },
    {
        name: 'WhatsApp',
        url: 'https://wa.me/250791527437',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
        ),
        hoverColor: 'hover:text-green-400',
    },
];

const Home = () => {
    const { t } = useTranslation();
    const [filters, setFilters] = React.useState({ titles: [], locations: [] });
    const [selectedJob, setSelectedJob] = React.useState('');
    const [selectedLocation, setSelectedLocation] = React.useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const { data } = await api.get('/jobs/filters');
                setFilters(data);
            } catch (err) {
                console.error('Error fetching filters:', err);
            }
        };
        fetchFilters();
    }, []);

    const handleSearch = () => {
        let query = '';
        if (selectedJob) query += `?title=${encodeURIComponent(selectedJob)}`;
        if (selectedLocation) query += `${query ? '&' : '?'}location=${encodeURIComponent(selectedLocation)}`;
        navigate(`/jobs${query}`);
    };

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

                    {/* Search Bar with Dropdowns */}
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/30 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 flex items-center bg-white rounded-xl px-5 py-4 shadow-sm relative group">
                            <Search className="text-blue-600 mr-3 shrink-0" size={22} />
                            <select
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800 font-medium appearance-none cursor-pointer pr-8"
                            >
                                <option value="">{t('home.searchPlaceholder')}</option>
                                {filters.titles.map((title) => (
                                    <option key={title} value={title}>{title}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center bg-white rounded-xl px-5 py-4 shadow-sm border-t md:border-t-0 md:border-l border-gray-100 relative group">
                            <MapPin className="text-emerald-500 mr-3 shrink-0" size={22} />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800 font-medium appearance-none cursor-pointer pr-8"
                            >
                                <option value="">{t('home.locationPlaceholder')}</option>
                                {filters.locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 pointer-events-none text-gray-400 group-hover:text-emerald-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
                        >
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
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <Link to="/signup" className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-300 shadow-lg">{t('home.getStarted')}</Link>
                        <Link to="/jobs" className="bg-transparent border-2 border-gray-600 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-300">{t('home.browseJobs')}</Link>
                    </div>

                    {/* Social Media Links for High Visibility */}
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">{t('footer.followUs')}</span>
                        <div className="flex items-center gap-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`text-white transition-all duration-300 transform hover:scale-125 ${social.hoverColor}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
