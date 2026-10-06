export const isAdminUser = (user) => {
    if (!user) return false;
    return user.role === "admin";
};

export const normalizeUser = (u) => u;

