import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import PageWrapper from "../components/PageWrapper";
import Seo from "../components/Seo";

const NotFoundPage = () => (
    <PageWrapper>
        <Seo
            title="Page not found — Anil Paneru"
            description="The page you were looking for could not be found."
            path="/"
        />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 py-12">
            <Terminal size={48} className="text-md-on-surface-variant/50" />
            <h1 className="text-6xl font-display font-bold text-md-on-background">404</h1>
            <p className="text-md-on-surface-variant text-lg">Page not found.</p>
            <Link
                to="/"
                className="px-6 py-3 rounded-full bg-md-on-background text-md-background font-medium hover:scale-105 transition-transform"
            >
                Go Home
            </Link>
        </div>
    </PageWrapper>
);

export default NotFoundPage;
