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
      <div className="mobile-app-shell min-h-screen text-md-on-background bg-md-background">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
<main id="main-content" className="mobile-main">
           <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
             <AnimatedRoutes />
           </div>
          <Footer />
        </main>
        <MobileScrollTop />
      </div>
    </Router>
  );
}

export default App;
