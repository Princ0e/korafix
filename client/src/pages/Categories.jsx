import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, PenTool, Home, Settings, Truck, Code, Heart, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const iconMap = {
    'Office': Briefcase,
    'Creative': PenTool,
    'Home': Home,
    'Technical': Code,
    'Mechanical': Settings,
    'Construction': Truck,
    'Healthcare': Heart,
    'Education': BookOpen,
    'Other': Briefcase
};

const Categories = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                // Sort categories so those with active jobs appear first!
                const sorted = [...data].sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0));
                setCategories(sorted);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">{t('categoriesPage.loading')}</p>
            </div>
        );
    }

    const toCamelCase = (str) => {
        if (!str) return '';
        return str
            .replace(/&/g, 'And')
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/[\s\-_]+/g, '');
    };

    const handleCategoryClick = (cat) => {
        // Navigate to jobs page filtered by this category
        navigate(`/jobs?category=${encodeURIComponent(cat.name)}`);
    };

    const getIconForCategory = (cat) => {
        if (cat.name?.toLowerCase().includes('driver') || cat.name?.toLowerCase().includes('transport')) {
            return Truck;
        }
        if (cat.name?.toLowerCase().includes('education') || cat.name?.toLowerCase().includes('teacher')) {
            return BookOpen;
        }
        if (cat.name?.toLowerCase().includes('web') || cat.name?.toLowerCase().includes('developer')) {
            return Code;
        }
        return iconMap[cat.group] || Briefcase;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-100">
                    <Sparkles size={16} />
                    <span>{t('home.categoriesDesc')}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {t('categoriesPage.title')}
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    {t('categoriesPage.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => {
                    const Icon = getIconForCategory(cat);
                    const count = cat.jobCount || 0;

                    return (
                        <div
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1 transform relative"
                        >
                            {/* Job count badge */}
                            <div className="absolute top-4 right-4">
                                {count > 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                        {count === 1 ? t('categoriesPage.jobsAvailable', { count }) : t('categoriesPage.jobsAvailable_plural', { count })}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium">
                                        {t('categoriesPage.noJobsYet')}
                                    </span>
                                )}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-2xl mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <Icon size={32} />
                            </div>

                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {t(`categories.${toCamelCase(cat.name)}`, { defaultValue: cat.name })}
                            </h3>

                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                                {t(`categories.${toCamelCase(cat.group)}`, { defaultValue: cat.group })}
                            </span>

                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {cat.description}
                            </p>

                            <button
                                type="button"
                                className="mt-auto inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 group-hover:gap-2.5 transition-all text-sm"
                            >
                                <span>{t('categoriesPage.browseExperts')}</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Categories;
