import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm shadow-xl shadow-blue-500/5 hover:bg-white/10 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse box-shadow-glow" />
                        <span>New: Admin Analytics Dashboard</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tight mb-8 leading-tight">
                        Shorten Your Links, <br />
                        <span className="text-gradient">
                            Expand Your Reach.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Transform long, ugly URLs into short, memorable links. Track clicks, analyze performance, and manage your links in one beautiful dashboard.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate("/signup")}
                            className="group px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1"
                        >
                            Get Started for Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => navigate("/dashboard")}
                             className="px-8 py-4 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-full hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                        >
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">How it works</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Simple, fast, and secure URL shortening in 3 steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Paste URL", desc: "Copy your long, messy link and paste it into our shortener." },
                            { step: "02", title: "Click Shorten", desc: "Get a unique, short URL instantly generated for you." },
                            { step: "03", title: "Share & Track", desc: "Share your new link anywhere and watch the clicks roll in." }
                        ].map((item, i) => (
                            <div key={i} className="glass p-8 rounded-3xl relative overflow-hidden group hover:bg-slate-800/40 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-8xl font-bold font-heading">{item.step}</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <span className="font-bold">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Features Section */}
             <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 -skew-y-3 transform origin-top-left scale-110" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, color: "blue", title: "Lightning Fast", desc: "Instantly generate links with zero latency. Redirections are handled in milliseconds." },
                            { icon: BarChart3, color: "purple", title: "Detailed Analytics", desc: "Track total clicks and engagement. Stay informed on how your links are performing." },
                             { icon: ShieldCheck, color: "green", title: "Secure & Reliable", desc: "Your data is safe with us. We use enterprise-grade encryption and security standards." }
                        ].map((feature, i) => (
                            <div key={i} className="glass p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-500">
                                <div className={`w-14 h-14 mx-auto ${
                                    feature.color === 'blue' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' : 
                                    feature.color === 'purple' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20' : 
                                    'bg-green-500/10 text-green-400 ring-green-500/20'
                                } rounded-2xl flex items-center justify-center mb-6 ring-1 shadow-lg`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer handled by Layout */}
        </div>
    );
};

export default LandingPage;
