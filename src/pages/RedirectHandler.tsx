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
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4 text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
                <p className="text-xl text-slate-400">Short URL not found or expired.</p>
                <p className="text-sm text-slate-600 mt-4">Debug: {errorMessage}</p>
                <a href="/" className="mt-8 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Go Home</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="z-10 flex flex-col items-center text-center max-w-lg w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
                {!urlData ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-6" />
                        <p className="text-slate-400 text-lg">Locating destination...</p>
                    </>
                ) : (
                    <>
                        <div className="relative mb-8">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    className="text-slate-800"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className="text-blue-500 transition-all duration-1000 ease-linear"
                                    strokeWidth="8"
                                    strokeDasharray={365}
                                    strokeDashoffset={365 - (365 * countdown) / 10}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className="text-4xl font-bold font-mono">{countdown}</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Redirecting You</h2>
                        <p className="text-slate-400 mb-6">You are being redirected to:</p>
                        
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 w-full mb-8 break-all">
                            <p className="text-blue-400 font-medium font-mono text-sm max-h-24 overflow-y-auto custom-scrollbar">
                                {urlData.originalUrl}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RedirectHandler;
