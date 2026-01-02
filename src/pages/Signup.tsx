import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
        <div className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
             {/* Background Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-md glass rounded-2xl p-8 md:p-10 relative z-10 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-purple-600/20 rounded-2xl mb-6 ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/20">
                        <UserPlus className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-white text-center">Create Account</h2>
                    <p className="text-slate-400 mt-3 text-center">Join us to start shortening URLs</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <Input 
                        label="Email Address"
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-900/50"
                    />
                    
                    <Input 
                        label="Password"
                        type="password" 
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-slate-900/50"
                    />

                     <Input 
                        label="Confirm Password"
                        type="password" 
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-slate-900/50"
                    />

                    <Button type="submit" className="w-full text-lg font-semibold shadow-xl shadow-purple-600/20 hover:bg-purple-600 border-purple-500/50" isLoading={loading}>
                        Sign Up
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button 
                        onClick={() => navigate("/login")}
                        className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-all"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
