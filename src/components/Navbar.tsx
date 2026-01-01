import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await toast.promise(
            logout(),
            {
                loading: 'Logging out...',
                success: 'Logged out successfully',
                error: 'Failed to log out'
            }
        );
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        SwiftLink
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {role === 'admin' && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="hidden md:flex">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="hidden md:flex">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>

                            <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block"></div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 hidden sm:block">
                                    {user.email}
                                </span>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-slate-400 hover:text-white">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-white text-slate-950 hover:bg-slate-200">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
