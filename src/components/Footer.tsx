const Footer = () => {
    return (
        <footer className="w-full mt-2 pt-6 pb-10 border-t border-md-outline/10 text-center relative">
            <div className="mx-auto max-w-2xl px-4 flex flex-col items-center gap-1.5 text-xs sm:text-sm text-md-on-surface-variant">
                <p>
                    Designed &amp; Developed by{" "}
                    <a
                        href="https://github.com/Theani7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md-on-background font-medium hover:underline decoration-neutral-400 underline-offset-4 transition-colors"
                    >
                        Ani7
                    </a>
                </p>
                <p className="text-[11px] sm:text-xs opacity-75">
                    &copy; 2026 All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
