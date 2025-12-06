import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState({
        name: 'Dr. Irfan',
        role: 'researcher',
        hasOnboarded: false // Simulator for onboarding flow
    });

    const login = (role) => setUser({ name: 'Dr. Irfan', role, hasOnboarded: false });
    const completeOnboarding = () => setUser(u => ({ ...u, hasOnboarded: true }));

    return (
        <AuthContext.Provider value={{ user, login, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
