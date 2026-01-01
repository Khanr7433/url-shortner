import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createShortUrl, getUserUrls, deleteShortUrl, type UrlData } from "../services/urlService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link2, Copy, ExternalLink, BarChart2, Trash2 } from "lucide-react";
import Pagination from "../components/Pagination";

const Dashboard = () => {
    const { user } = useAuth(); // Removed logOut as it might not be needed or exists differently
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true); // Loading for fetching
    const [shortenLoading, setShortenLoading] = useState(false); // Loading for shorten action
    const [error, setError] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    useEffect(() => {
        if (user) {
            fetchUrls();
        }
    }, [user, page]);

    const fetchUrls = async () => {
        if (!user?.uid) return;
        try {
            const { data, count } = await getUserUrls(user.uid, page, LIMIT);
            setUrls(data);
            setTotalPages(Math.ceil(count / LIMIT));
        } catch (error) {
            console.error("Failed to fetch URLs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !url) return;
        setError("");
        setShortenLoading(true);

        // Basic URL validation
        let urlToShorten = url;
        if (!/^https?:\/\//i.test(urlToShorten)) {
            urlToShorten = 'https://' + urlToShorten;
        }

        try {
            await createShortUrl(urlToShorten, user.uid, customAlias || undefined, title || undefined);
            
            toast.success("URL Shortened!", {
                icon: '🚀',
                style: {
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid #1e293b'
                }
            });

            await fetchUrls(); 
            setUrl("");
            setTitle("");
            setCustomAlias("");
        } catch (err: any) {
             setError(err.message || "Failed to shorten URL");
             toast.error(err.message || "Failed");
        } finally {
            setShortenLoading(false);
        }
    };

    const handleCopy = (shortCode: string) => {
        const fullUrl = `${window.location.origin}/${shortCode}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("Copied to clipboard!");
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this URL?")) return;
        
        const promise = deleteShortUrl(id);

        toast.promise(promise, {
            loading: 'Deleting URL...',
            success: 'URL deleted successfully',
            error: 'Failed to delete URL'
        }).then(() => {
            setUrls(urls.filter(url => url.id !== id));
            // Optional: Handle page empty logic
            if (urls.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchUrls();
            }
        }).catch((error) => {
            console.error("Failed to delete URL", error);
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                {/* Header handled by Navbar */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400">Manage your links and view analytics</p>
                </div>

                {/* Shortener Form */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                     {/* Decorative background glow */}
                     <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                            <Link2 className="w-5 h-5 mr-2 text-blue-500" />
                            Create New Short Link
                        </h2>

                        <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-4">
                                <Input 
                                    placeholder="Paste your long URL here" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="h-12 text-base md:text-lg bg-slate-950/50"
                                    required
                                />
                                <Input 
                                    placeholder="Link Title (Optional)" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-10 text-sm bg-slate-950/50"
                                />
                            </div>
                            <Button size="lg" type="submit" isLoading={shortenLoading} className="h-auto px-8 self-start md:self-stretch">
                                Shorten
                            </Button>
                        </form>
                        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
                    </div>
                </div>

                {/* URLs List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-300">Your Links</h3>
                    
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading links...</div>
                    ) : urls.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-slate-500">
                            No links created yet. Start shortening!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {urls.map((url) => (
                                <div key={url.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <a 
                                                href={`/${url.shortCode}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-lg font-bold text-blue-400 hover:text-blue-300 truncate"
                                            >
                                                {window.location.host}/{url.shortCode}
                                            </a>
                                            {url.title && (
                                                <span className="hidden md:inline-block text-sm font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded ml-2">
                                                    {url.title}
                                                </span>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-slate-500 hover:text-white"
                                                onClick={() => handleCopy(url.shortCode)}
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-slate-500 hover:text-red-400"
                                                onClick={() => url.id && handleDelete(url.id)}
                                                title="Delete URL"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate flex items-center">
                                            <ExternalLink className="w-3 h-3 mr-1 inline" />
                                            {url.originalUrl}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 text-sm text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
                                        
                                         <div className="flex items-center gap-2" title="Total Clicks">
                                            <BarChart2 className="w-4 h-4 text-slate-500" />
                                            <span className="font-medium text-slate-200">{url.clicks}</span> clicks
                                        </div>
                                        
                                        <div className="text-xs text-slate-600">
                                            {url.createdAt?.toDate ? url.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
