import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { User, Briefcase, MapPin, MessageSquare, Star, Search } from 'lucide-react';

const Workers = () => {
    const { t } = useTranslation();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const { data } = await api.get('/users');
                setWorkers(data);
            } catch (err) {
                console.error('Error fetching workers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkers();
    }, []);

    const filteredWorkers = workers.filter(w =>
        (w.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        w.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        (w.bio?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Skilled Professionals</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Discover and connect with experts across Rwanda. Quality service for every need.
                </p>

                <div className="mt-8 max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by skill, name or profession..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading experts...</div>
            ) : filteredWorkers.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <User size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No experts found</h3>
                    <p className="text-gray-500 mt-2">Try searching for a different skill or name.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWorkers.map((worker) => (
                        <div key={worker._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                            <div className="h-2 bg-blue-600"></div>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{worker.name}</h3>
                                        {worker.location?.city && (
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin size={14} className="mr-1" />
                                                {worker.location.city}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {worker.skills && worker.skills.length > 0 ? (
                                            worker.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No skills listed yet</span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                    {worker.bio || "This professional hasn't added a bio yet, but they are ready to help with your project!"}
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                {worker.socialLinks?.whatsapp ? (
                                    <a
                                        href={`https://wa.me/${worker.socialLinks.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-green-600 font-bold hover:text-green-700 transition-colors"
                                    >
                                        <MessageSquare size={18} className="mr-2" />
                                        WhatsApp
                                    </a>
                                ) : (
                                    <div className="text-gray-400 text-sm font-medium flex items-center">
                                        <MessageSquare size={18} className="mr-2" />
                                        No Number
                                    </div>
                                )}

                                <div className="flex items-center text-blue-600 font-bold text-sm">
                                    View Profile <Star size={14} className="ml-1 fill-blue-600" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Workers;
