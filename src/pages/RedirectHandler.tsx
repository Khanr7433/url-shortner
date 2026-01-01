import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUrlByShortCode, incrementClicks } from "../services/urlService";
import { Loader2 } from "lucide-react";

const RedirectHandler = () => {
    const { shortCode } = useParams<{ shortCode: string }>();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const resolveUrl = async () => {
            if (!shortCode) return;
            try {
                const urlData = await getUrlByShortCode(shortCode);
                if (urlData) {
                    await incrementClicks(urlData.id!);
                    window.location.href = urlData.originalUrl;
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-400">Redirecting...</p>
            </div>
        </div>
    );
};

export default RedirectHandler;
