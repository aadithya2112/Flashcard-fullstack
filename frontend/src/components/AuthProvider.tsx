import { createContext, PropsWithChildren, useContext, useState } from "react";
import { User } from "../types/User";

const AuthContext = createContext<User | null>(null)

type AuthProviderProps = PropsWithChildren & {
    isSignedIn: boolean,
}

export default function AuthProvider({ children, isSignedIn }: AuthProviderProps) {
    function getUserToken() {
        return localStorage.getItem('token')
    }
    const [userToken] = useState(() => (isSignedIn ? getUserToken() : null))

    return (
        <AuthContext.Provider value={userToken}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}