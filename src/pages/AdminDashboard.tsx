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
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto space-y-12">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Users</p>
                                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Link className="w-8 h-8 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total URLs</p>
                                <p className="text-3xl font-bold">{stats.totalUrls}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <BarChart3 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Clicks</p>
                                {/* Note: This might be inaccurate if dependent on page data, but keeping stats.totalClicks for now */}
                                <p className="text-3xl font-bold">{stats.totalClicks || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold">All Users</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-950/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">UID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {users.map((user) => (
                                        <tr key={user.uid} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700/50 text-slate-300'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button 
                                                    onClick={() => handleRoleChange(user.uid, user.role)}
                                                    className={`text-xs font-medium px-3 py-1 rounded border transition-colors ${
                                                        user.role === 'admin' 
                                                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' 
                                                        : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                                                    }`}
                                                >
                                                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-mono">{user.uid}</td>
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
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold">All URLs</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-950/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Short Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Original URL</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Clicks</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Creator ID</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {urls.map((url) => (
                                        <tr key={url.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a href={`/${url.shortCode}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 font-medium">
                                                    {url.shortCode}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                                {url.title || <span className="text-slate-600 italic">No Title</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400 max-w-xs truncate" title={url.originalUrl}>
                                                {url.originalUrl}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-white font-bold">{url.clicks}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-mono">{url.userId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button 
                                                    onClick={() => url.id && handleDeleteUrl(url.id)}
                                                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
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
