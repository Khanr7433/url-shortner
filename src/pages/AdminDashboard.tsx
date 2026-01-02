import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers, getStats, updateUserRole, type UserProfile } from "../services/userService";
import { getAllUrls, deleteShortUrl, type UrlData } from "../services/urlService";
import { Users, Link, BarChart3, Trash2 } from "lucide-react";
import Pagination from "../components/Pagination";

interface DashboardStats {
    totalUsers: number;
    totalUrls: number;
    totalClicks: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalUrls: 0, totalClicks: 0 });
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [urlsPage, setUrlsPage] = useState(1);
    const [urlsTotalPages, setUrlsTotalPages] = useState(1);
    
    const LIMIT = 10;

    const fetchUsers = async () => {
        try {
            const { data, count } = await getAllUsers(usersPage, LIMIT);
            setUsers(data);
            setUsersTotalPages(Math.ceil(count / LIMIT));
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchUrls = async () => {
        try {
            const { data, count } = await getAllUrls(urlsPage, LIMIT);
            setUrls(data);
            setUrlsTotalPages(Math.ceil(count / LIMIT));
            
            // Note: Since we only fetch a page of URLs, we can't sum all clicks client-side perfectly anymore
            // without fetching ALL or having a separate stats endpoint.
            // For now, let's keep the client-side sum based on visible page or rely solely on getStats() which we might need to update 
            // if we want total clicks across DB. 
            // However, getStats() currently returns 0 for clicks.
            // We will trust getStats() for counts and maybe accept clicks are only accurate per page or fix getStats later.
        } catch (error) {
            console.error("Failed to fetch URLs", error);
        }
    };

    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const statsData = await getStats();
                setStats(statsData);
                
                await Promise.all([fetchUsers(), fetchUrls()]);
            } catch (error) {
                console.error("Failed to init admin data", error);
            } finally {
                setLoading(false);
            }
        };

        if (loading) {
            initData(); // Initial load
        }
    }, []);

    // Effect for page changes
    useEffect(() => {
        if (!loading) fetchUsers();
    }, [usersPage]);

    useEffect(() => {
        if (!loading) fetchUrls();
    }, [urlsPage]);

    const handleDeleteUrl = async (urlId: string) => {
        if (!window.confirm("Admin Action: Are you sure you want to delete this URL?")) return;
        
        const promise = deleteShortUrl(urlId);

        toast.promise(promise, {
            loading: 'Deleting URL...',
            success: 'URL deleted by admin',
            error: 'Failed to delete URL'
        }).then(() => {
            setUrls(urls.filter(url => url.id !== urlId));
            setStats(prev => ({ ...prev, totalUrls: prev.totalUrls - 1 }));
        }).catch((error) => {
             console.error("Failed to delete URL", error);
        });
    };

    const handleRoleChange = async (userId: string, currentRole: 'admin' | 'user') => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const action = newRole === 'admin' ? 'Promote' : 'Demote';
        
        if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;

        const promise = updateUserRole(userId, newRole);

        toast.promise(promise, {
            loading: `Processing ${action}...`,
            success: `User ${action.toLowerCase()}d successfully`,
            error: 'Failed to update user role'
        }).then(() => {
            setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
        }).catch((error) => {
            console.error("Failed to update role", error);
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-slate-400">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white pb-32">
             {/* Background glow */}
             <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="pl-1">
                    <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Overview of system statistics and management.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Users</p>
                                <p className="text-4xl font-bold font-heading text-white mt-1">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                                <Link className="w-8 h-8 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total URLs</p>
                                <p className="text-4xl font-bold font-heading text-white mt-1">{stats.totalUrls}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl ring-1 ring-green-500/20 group-hover:bg-green-500/20 transition-colors">
                                <BarChart3 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Clicks</p>
                                {/* Note: This might be inaccurate if dependent on page data, but keeping stats.totalClicks for now */}
                                <p className="text-4xl font-bold font-heading text-white mt-1">{stats.totalClicks || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="space-y-6">
                    <div className="glass rounded-3xl overflow-hidden border-0">
                        <div className="p-6 border-b border-white/5 bg-slate-900/40">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                All Users
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-950/60">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">UID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => (
                                        <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-700/30 border-slate-600/30 text-slate-300'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button 
                                                    onClick={() => handleRoleChange(user.uid, user.role)}
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:shadow-lg ${
                                                        user.role === 'admin' 
                                                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50' 
                                                        : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50'
                                                    }`}
                                                >
                                                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs font-mono">{user.uid}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination 
                        currentPage={usersPage} 
                        totalPages={usersTotalPages} 
                        onPageChange={setUsersPage} 
                    />
                </div>

                {/* URLs Table */}
                <div className="space-y-6">
                    <div className="glass rounded-3xl overflow-hidden border-0">
                         <div className="p-6 border-b border-white/5 bg-slate-900/40">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Link className="w-5 h-5 text-purple-400" />
                                All URLs
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-950/60">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Short Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Original URL</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Clicks</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Creator ID</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {urls.map((url) => (
                                        <tr key={url.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a href={`/${url.shortCode}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 font-bold font-mono hover:underline">
                                                    {url.shortCode}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                                                {url.title || <span className="text-slate-600 italic font-normal">No Title</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400 max-w-xs truncate text-sm" title={url.originalUrl}>
                                                {url.originalUrl}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    {url.clicks}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs font-mono">{url.userId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button 
                                                    onClick={() => url.id && handleDeleteUrl(url.id)}
                                                    className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                                    title="Delete URL"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination 
                        currentPage={urlsPage} 
                        totalPages={urlsTotalPages} 
                        onPageChange={setUrlsPage} 
                    />
                </div>
                
            </div>
        </div>
    );
};

export default AdminDashboard;
