import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, PenTool, Home, Settings, Truck, Code, Heart, BookOpen } from 'lucide-react';

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

const colorMap = {
    'Office': 'blue',
    'Creative': 'purple',
    'Home': 'green',
    'Technical': 'cyan',
    'Mechanical': 'orange',
    'Construction': 'yellow',
    'Healthcare': 'red',
    'Education': 'indigo',
    'Other': 'gray'
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
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div className="text-center py-20">{t('categoriesPage.loading')}</div>;

    const toCamelCase = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    };

    const handleCategoryClick = (cat) => {
        // Navigate to jobs page filtered by this category's name (most specific) or group
        navigate(`/jobs?category=${encodeURIComponent(cat.name)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">{t('categoriesPage.title')}</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t('categoriesPage.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.group] || Briefcase;
                    return (
                        <div
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1 transform"
                        >
                            <div className="bg-blue-50 p-4 rounded-2xl mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <Icon size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {t(`categories.${toCamelCase(cat.name)}`, { defaultValue: cat.name })}
                            </h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-3 py-1 rounded-full mb-4">
                                {t(`categories.${toCamelCase(cat.group)}`, { defaultValue: cat.group })}
                            </span>
                            <p className="text-gray-500 leading-relaxed">{cat.description}</p>
                            <button
                                type="button"
                                className="mt-6 text-blue-600 font-semibold hover:text-blue-700 flex items-center group-hover:font-bold transition-all"
                            >
                                {t('categoriesPage.browseExperts')} <span className="ml-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0">→</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Categories;
