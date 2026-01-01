import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Navbar */}
            {/* Navbar handled by Layout */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        New: Admin Analytics Dashboard
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Shorten Your Links, <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Expand Your Reach.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Transform long, ugly URLs into short, memorable links. Track clicks, analyze performance, and manage your links in one beautiful dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate("/signup")}
                            className="group px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-all flex items-center gap-2"
                        >
                            Get Started for Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => navigate("/dashboard")} // Should ask to login if not
                             className="px-8 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-full hover:bg-slate-800 transition-all"
                        >
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How it works</h2>
                        <p className="text-slate-400">Simple, fast, and secure URL shortening in 3 steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Paste URL", desc: "Copy your long, messy link and paste it into our shortener." },
                            { step: "02", title: "Click Shorten", desc: "Get a unique, short URL instantly generated for you." },
                            { step: "03", title: "Share & Track", desc: "Share your new link anywhere and watch the clicks roll in." }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors group">
                                <span className="text-6xl font-bold text-slate-800/50 absolute top-4 right-6 pointer-events-none group-hover:text-blue-500/10 transition-colors">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-bold mb-4 text-blue-100">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Features Section */}
             <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
                            <p className="text-slate-400">Instantly generate links with zero latency. Redirections are handled in milliseconds.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Detailed Analytics</h3>
                            <p className="text-slate-400">Track total clicks and engagement. Stay informed on how your links are performing.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Secure & Reliable</h3>
                            <p className="text-slate-400">Your data is safe with us. We use enterprise-grade encryption and security standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* Footer handled by Layout */}
        </div>
    );
};

export default LandingPage;
