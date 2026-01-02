import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
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
        <nav className="fixed top-0 w-full z-50 glass border-b-0">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors duration-300 ring-1 ring-blue-500/20">
                        <LinkIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight text-gradient">
                        SwiftLink
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {role === 'admin' && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-white/5 data-[active]:bg-white/10">
                                        <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-white/5">
                                    <LayoutDashboard className="w-4 h-4 mr-2 text-blue-400" />
                                    Dashboard
                                </Button>
                            </Link>

                            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 hidden sm:block font-medium">
                                    {user.email}
                                </span>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="hover:scale-105 transition-transform"
                                >
                                    <LogOut className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300">
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
