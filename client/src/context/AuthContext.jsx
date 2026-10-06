import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { isAdminUser, normalizeUser } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('userInfo')) || null;
            return normalizeUser(saved);
        } catch {
            return null;
        }
    });
    const [loading] = useState(false);

    useEffect(() => {
        const refreshProfile = async () => {
            const saved = localStorage.getItem('userInfo');
            if (!saved) return;
            try {
                const parsed = JSON.parse(saved);
                if (!parsed?.token) return;
                const { data } = await api.get('/users/profile');
                if (data) {
                    const updated = normalizeUser({ ...parsed, ...data, token: parsed.token });
                    setUser(updated);
                    localStorage.setItem('userInfo', JSON.stringify(updated));
                }
            } catch (err) {
                console.error('Failed to refresh user profile:', err.message);
            }
        };
        refreshProfile();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            const normalized = normalizeUser(data);
            setUser(normalized);
            localStorage.setItem('userInfo', JSON.stringify(normalized));
            return { success: true, user: normalized };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await api.post('/users', userData);
            const normalized = normalizeUser(data);
            setUser(normalized);
            localStorage.setItem('userInfo', JSON.stringify(normalized));
            return { success: true, user: normalized };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const isAdmin = isAdminUser(user);

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
