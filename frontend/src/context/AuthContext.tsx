import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Load auth from local storage on mount
        const storedToken = localStorage.getItem("fitness_ai_token");
        const storedUser = localStorage.getItem("fitness_ai_user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("fitness_ai_token", newToken);
        localStorage.setItem("fitness_ai_user", JSON.stringify(newUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("fitness_ai_token");
        localStorage.removeItem("fitness_ai_user");
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
