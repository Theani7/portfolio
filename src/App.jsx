import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Container from "./components/Container";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/FloatingChatbot";
import MobileScrollTop from "./components/MobileScrollTop";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
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
          <Container>
            <AnimatedRoutes />
          </Container>
          <Footer />
        </main>
        <MobileScrollTop />
        <FloatingChatbot />
      </div>
    </Router>
  );
}

export default App;
