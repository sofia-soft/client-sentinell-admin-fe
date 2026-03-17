import {useState, useContext, useMemo, useCallback, useEffect} from 'react';
import {AuthContext} from './AuthContext';
import * as authApi from '../api/authApi';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Функция за пълно изчистване на сесията (използва се при logout и изтекла сесия)
    const clearAuth = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    const login = useCallback(async (credentials) => {
        const response = await authApi.loginApi(credentials);

        if (response?.status === 200) {
            const serverJson = response.data;

            const authData = {
                username: credentials.username,
                permissions: serverJson?.data?.permissions || [],
                is_superuser: serverJson?.data.is_superuser || 0,
                expiresAt: Date.now() + (serverJson?.data?.expires_in ?? 0) * 1000
            };

            setUser(authData);
            localStorage.setItem('user', JSON.stringify(authData));
            return {success: true};
        }

        return {
            success: false,
            error: response?.data?.message || response?.data?.data?.error || 'Невалидни данни за вход'
        };
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    useEffect(() => {
        const handleAuthExpired = () => {
            console.warn("Session expired. Clearing user state.");
            clearAuth();
        };

        window.addEventListener('auth-expired', handleAuthExpired);

        return () => {
            window.removeEventListener('auth-expired', handleAuthExpired);
        };
    }, [clearAuth]);

    const hasPermission = useCallback((resource, action) => {
        if (user?.is_superuser === 1 || user?.is_superuser === true) {
            return true;
        }
        return user?.permissions?.some(
            p => p.resource === resource && p.action === action
        ) ?? false;
    }, [user]);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission
    }), [user, login, logout, hasPermission]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};