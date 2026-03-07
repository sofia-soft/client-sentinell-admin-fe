import {useState, useContext, useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';
import {AuthContext} from './AuthContext';
import * as authApi from '../api/authApi'; // Твоите JS функции

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = useCallback(async (credentials) => {
        const response = await authApi.loginApi(credentials);

        if (response?.status === 200) {
            const serverJson = response.data;

            const authData = {
                username: credentials.username,
                permissions: serverJson?.data?.permissions || [],
                expiresAt: Date.now() + (serverJson?.data?.expires_in ?? 0) * 1000
            };

            setUser(authData);
            localStorage.setItem('user', JSON.stringify(authData));
            return { success: true };
        }

        return {
            success: false,
            error: response?.data?.message || response?.error || 'Невалидни данни за вход'
        };
    }, []);
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    }, []);

    const hasPermission = useCallback((resource, action) => {
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

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};