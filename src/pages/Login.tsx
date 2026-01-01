import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogIn } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Redirect when user is authenticated
    useEffect(() => {
        if (user) {
            navigate(searchParams.get("redirectTo") || "/dashboard");
        }
    }, [user, navigate, searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const loginPromise = login(email, password);

        toast.promise(loginPromise, {
            loading: 'Signing in...',
            success: 'Welcome back!',
            error: 'Failed to log in. Please check your credentials.'
        }).catch((err) => {
            console.error(err);
            setError("Failed to log in. Please check your credentials.");
            setLoading(false);
        });
        
        // We catch above to handle UI state, but await here if we needed to do something else.
        // The toast handles the visual feedback.
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl backdrop-blur-sm bg-opacity-80">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Sign in to manage your short URLs</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <Input 
                        label="Email Address"
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <Input 
                        label="Password"
                        type="password" 
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <button 
                        onClick={() => navigate("/signup")}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
