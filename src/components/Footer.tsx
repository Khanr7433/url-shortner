const Footer = () => {
    return (
        <footer className="py-8 border-t border-slate-800 bg-slate-950 text-center mt-auto">
            <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} SwiftLink. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
