import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../supabase";
import { getUserProfile, createUserProfile, type UserProfile } from "../services/userService";

interface User extends UserProfile {
    // user profile properties extended
}

interface AuthContextType {
    user: User | null;
    role: 'user' | 'admin' | null;
    loading: boolean;
    signup: (email: string, password: string) => Promise<{ user: any; session: any } | null>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    return useContext(AuthContext)!;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Derived role from user profile
    const role = user?.role || null;

    useEffect(() => {
        console.log("AuthContext: Initializing...");
        
        // Safety valve: Force stop loading after 5 seconds if Supabase hangs
        const safetyTimeout = setTimeout(() => {
            console.warn("AuthContext: Safety timeout triggered. Supabase might be unreachable.");
            setLoading(false);
        }, 5000);

        // Initial session check
        const checkSession = async () => {
             console.log("AuthContext: Checking session...");
             try {
                 const { data: { session }, error } = await supabase.auth.getSession();
                 if (error) console.error("AuthContext: getSession error", error);
                 
                 console.log("AuthContext: Session found?", !!session);
                 
                 if (session?.user) {
                     await fetchProfile(session.user.id, session.user.email!);
                 } else {
                     setLoading(false);
                 }
             } catch (err) {
                 console.error("AuthContext: checkSession failed", err);
                 setLoading(false);
             }
        };
        
        checkSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("AuthContext: Auth State Change:", event);
            if (session?.user) {
                await fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (uid: string, email: string) => {
        try {
             // Race condition: If DB takes > 2s, just use session data (fallback)
            const profilePromise = getUserProfile(uid);
            const timeoutPromise = new Promise<null>((resolve) => 
                setTimeout(() => resolve(null), 2000)
            );

            const profile = await Promise.race([profilePromise, timeoutPromise]);
            
            if (profile) {
                setUser(profile);
            } else {
                console.warn("Profile not found or DB slow. Creating/Using fallback...");
                createUserProfile(uid, email).catch(console.error);
                setUser({ uid, email, role: 'user', createdAt: new Date() });
            }
        } catch (err) {
            console.error("AuthContext: fetchProfile failed", err);
            setUser({ uid, email, role: 'user', createdAt: new Date() });
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string) => {
        console.log("Attempting signup for:", email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        
        if (error) {
            console.error("Signup error:", error.message, error);
            throw error;
        }
        console.log("Signup successful", data);
        return data; // Return data so UI knows if session was created
    };

    const login = async (email: string, password: string) => {
        console.log("Attempting login for:", email);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
             console.error("Login error:", error.message, error);
             throw error;
        }
        console.log("Login successful");
    };

    const logout = async () => {
        console.log("AuthContext: Logging out...");
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Logout error:", error.message, error);
            }
        } catch (err) {
            console.error("Logout exception:", err);
        } finally {
            // Always clear local state
            setUser(null);
            console.log("AuthContext: Local user cleared.");
        }
    };

    const value = {
        user,
        role,
        loading,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Loading URL Shortener...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
