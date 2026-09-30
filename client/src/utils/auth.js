export const isAdminUser = (user) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const email = (user.email || '').toLowerCase().trim();
    const adminEmails = [
        'admin@example.com',
        'qickfixer70@gmail.com',
        'quickfixer70@gmail.com',
        'princerukesha@gmail.com'
    ];
    if (adminEmails.includes(email)) return true;
    if (user.name && user.name.toLowerCase().trim() === 'admin user') return true;
    return false;
};

export const normalizeUser = (u) => {
    if (!u) return null;
    if (isAdminUser(u)) {
        return { ...u, role: 'admin' };
    }
    return u;
};
