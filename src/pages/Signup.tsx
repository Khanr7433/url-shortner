import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { UserPlus } from "lucide-react";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            const msg = "Passwords do not match";
            setError(msg);
            return toast.error(msg);
        }

        if (password.length < 6) {
             const msg = "Password must be at least 6 characters";
            setError(msg);
            return toast.error(msg);
        }

        const toastId = toast.loading("Creating your account...");
        setLoading(true);

        try {
            const data = await signup(email, password);
            
            if (data?.session) {
                toast.success("Account created! Redirecting...", { id: toastId });
                // useEffect will handle redirect when 'user' updates
            } else if (data?.user) {
                 // User created but no session -> Email Confirmation Required
                 toast.success("Account created! Please check your email to confirm.", { id: toastId, duration: 5000 });
                 setLoading(false);
                 setTimeout(() => navigate("/login"), 3000);
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.message || "Failed to create an account.";
            setError(msg);
            toast.error(msg, { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl backdrop-blur-sm bg-opacity-80">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join us to start shortening URLs</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                     <Input 
                        label="Confirm Password"
                        type="password" 
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button 
                        onClick={() => navigate("/login")}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
