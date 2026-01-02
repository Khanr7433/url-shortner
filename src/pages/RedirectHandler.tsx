import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUrlByShortCode, incrementClicks } from "../services/urlService";
import { Loader2 } from "lucide-react";

const RedirectHandler = () => {
    const { shortCode } = useParams<{ shortCode: string }>();
    const [errorMessage, setErrorMessage] = useState("");
    const [urlData, setUrlData] = useState<{ originalUrl: string } | null>(null);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const resolveUrl = async () => {
            if (!shortCode) return;
            try {
                const data = await getUrlByShortCode(shortCode);
                if (data) {
                    setUrlData(data);
                    await incrementClicks(data.id!);
                } else {
                    setErrorMessage("Document not found in database.");
                }
            } catch (error: any) {
                console.error(error);
                setErrorMessage(error.message || "Unknown error occurred.");
            }
        };

        resolveUrl();
    }, [shortCode]);

    useEffect(() => {
        if (!urlData) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            window.location.href = urlData.originalUrl;
        }
    }, [countdown, urlData]);

    if (errorMessage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="glass p-12 rounded-3xl border-red-500/20 max-w-md w-full relative z-10">
                    <h1 className="text-6xl font-heading font-bold mb-4 text-red-500 drop-shadow-lg">404</h1>
                    <p className="text-2xl font-semibold mb-2">Link Not Found</p>
                    <p className="text-slate-400 mb-8">The link you are looking for has expired or does not exist.</p>
                    
                    {import.meta.env.DEV && (
                        <div className="bg-red-950/50 border border-red-900/50 p-3 rounded-lg text-xs text-red-300 font-mono mb-6 break-all">
                           Error: {errorMessage}
                        </div>
                    )}
                    
                    <a href="/" className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="z-10 flex flex-col items-center text-center max-w-lg w-full glass p-10 rounded-3xl shadow-2xl border border-white/5">
                {!urlData ? (
                    <div className="flex flex-col items-center py-10">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-6" />
                        <h2 className="text-2xl font-heading font-bold mb-2">Locating Destination</h2>
                        <p className="text-slate-400 text-lg">Please wait a moment...</p>
                    </div>
                ) : (
                    <>
                        <div className="relative mb-10">
                            {/* SVG Timer */}
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    className="text-slate-800"
                                    strokeWidth="6"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                                <circle
                                    className="text-blue-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    strokeWidth="6"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * countdown) / 10}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                    style={{ filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))" }}
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                <span className="text-5xl font-heading font-bold text-white">{countdown}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest mt-1">Seconds</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-heading font-bold mb-3 text-white">Redirecting You</h2>
                        <p className="text-slate-400 mb-8">You are being taken to your destination.</p>
                        
                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 w-full mb-2 shadow-inner">
                            <p className="text-blue-400 font-medium font-mono text-sm break-all">
                                {urlData.originalUrl}
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Not redirecting? <a href={urlData.originalUrl} className="text-blue-400 hover:underline">Click here</a>
                        </p>
                    </>
                )}
            </div>
            
            <div className="absolute bottom-8 text-slate-600 text-sm font-medium">
                Powered by <span className="text-slate-400">SwiftLink</span>
            </div>
        </div>
    );
};
export default RedirectHandler;
