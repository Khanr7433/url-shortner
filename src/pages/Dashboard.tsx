import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { createShortUrl, getUserUrls, deleteShortUrl, type UrlData } from "../services/urlService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link2, Copy, ExternalLink, BarChart2, Trash2, Share2 } from "lucide-react";
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

    const handleShare = async (shortCode: string, title?: string) => {
        const fullUrl = `${window.location.origin}/${shortCode}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Shortened URL',
                    text: 'Check out this link!',
                    url: fullUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopy(shortCode); // Fallback to copy
            toast.success("Link copied to clipboard (Sharing not supported)");
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
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 pb-32">
             {/* Background glow for dashboard */}
             <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
             <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                {/* Header handled by Navbar */}
                <div className="mb-8 pl-1">
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">Manage your links and track their performance.</p>
                </div>

                {/* Shortener Form */}
                <div className="glass p-1 rounded-3xl shadow-2xl relative overflow-hidden group animate-fade-in-up">
                     {/* Decorative background glow */}
                     <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700"></div>

                    <div className="relative z-10 bg-slate-950/40 backdrop-blur-md rounded-[20px] p-8 border border-white/5">
                        <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center">
                            <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                                <Link2 className="w-5 h-5 text-blue-400" />
                            </div>
                            Create New Short Link
                        </h2>

                        <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-4">
                                <Input 
                                    placeholder="Paste your long URL here" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="h-14 text-base md:text-lg bg-slate-900/60 border-slate-800/60 focus:bg-slate-900/80"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <Input 
                                        placeholder="Link Title (Optional)" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-11 text-sm bg-slate-900/60 border-slate-800/60"
                                    />
                                    <Input 
                                        placeholder="Custom Alias (Optional)" 
                                        value={customAlias}
                                        onChange={(e) => setCustomAlias(e.target.value)}
                                        className="h-11 text-sm bg-slate-900/60 border-slate-800/60"
                                    />
                                </div>
                            </div>
                            <Button size="lg" type="submit" isLoading={shortenLoading} className="h-auto py-4 px-8 self-start md:self-stretch shadow-xl shadow-blue-600/20 text-base font-semibold">
                                Shorten
                            </Button>
                        </form>
                        {error && <p className="text-red-400 mt-4 text-sm bg-red-500/10 p-2 rounded-lg inline-block px-4">{error}</p>}
                    </div>
                </div>

                {/* URLs List */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-slate-300 pl-1 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        Your Links
                    </h3>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : urls.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                            <p className="text-lg mb-2">No links created yet</p>
                            <p className="text-sm">Paste a URL above to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {urls.map((url, index) => (
                                <div key={url.id} className="glass group p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-all duration-300 hover:scale-[1.005] hover:shadow-lg hover:shadow-blue-900/5 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <a 
                                                href={`/${url.shortCode}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-lg font-bold text-blue-400 hover:text-blue-300 truncate font-heading hover:underline underline-offset-4"
                                            >
                                                {window.location.host}/{url.shortCode}
                                            </a>
                                            {url.title && (
                                                <span className="inline-flex items-center text-xs font-medium text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                                                    {url.title}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 truncate flex items-center gap-1 group-hover:text-slate-400 transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            {url.originalUrl}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-slate-400 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 bg-slate-900/20 md:bg-transparent -mx-5 md:mx-0 px-5 md:px-0 py-2 md:py-0 rounded-b-2xl md:rounded-none">
                                        <div className="flex items-center gap-6 flex-1 md:flex-none justify-between md:justify-start">
                                            <div className="flex items-center gap-2" title="Total Clicks">
                                                <div className="p-1.5 bg-slate-800 rounded-md">
                                                    <BarChart2 className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="font-bold text-white text-base">{url.clicks}</span>
                                            </div>
                                            
                                            <div className="text-xs text-slate-500 font-medium">
                                                {url.createdAt?.toDate ? url.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10"
                                                onClick={() => handleCopy(url.shortCode)}
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-9 w-9 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                                                onClick={() => handleShare(url.shortCode, url.title)}
                                                title="Share URL"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => url.id && handleDelete(url.id)}
                                                title="Delete URL"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
