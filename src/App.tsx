import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResumePage from "./pages/ResumePage";
import SetupPage from "./pages/SetupPage";
import Footer from "./components/Footer";
import MobileScrollTop from "./components/MobileScrollTop";
import MobileTabBar from "./components/MobileTabBar";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="mobile-app-shell min-h-screen text-md-on-background bg-md-background pb-[calc(env(safe-area-inset-bottom)+5.5rem)] sm:pb-0">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="mobile-main relative">
          <div className="relative mx-auto max-w-2xl px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className="absolute top-0 bottom-0 left-0 grid-line-v hidden sm:block" />
            <div className="absolute top-0 bottom-0 right-0 grid-line-v hidden sm:block" />
            <AnimatedRoutes />
          </div>
          <Footer />
        </main>
        <MobileScrollTop />
        <MobileTabBar />
      </div>
    </Router>
  );
}

export default App;
