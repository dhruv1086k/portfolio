import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollProgress from "../components/common/ScrollProgress";
import SmoothScroll from "../components/common/SmoothScroll";
import GridLoader from "../components/common/GridLoader";
import { useLoader } from "../context/LoaderContext";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

export default function RootLayout() {
  const location = useLocation();
  const { setLoaderDone } = useLoader();

  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const navLogoRef = useRef(null);

  // Watch for page resources to finish loading
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      const handleLoad = () => setIsLoading(false);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Called by GridLoader when its internal drop animation is done
  const handleLoaderDone = () => {
    setShowLoader(false);
  };

  // Called by AnimatePresence AFTER the exit fade fully completes
  // This is the single source of truth — nothing animates until this fires
  const handleFadeComplete = () => {
    setLoaderDone(true);
  };

  return (
    <>
      {/* Loader overlay — fades out, then signals the rest of the app */}
      <AnimatePresence onExitComplete={handleFadeComplete}>
        {showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <GridLoader isLoading={isLoading} onDone={handleLoaderDone} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app */}
      <SmoothScroll>
        <ScrollProgress />
        <Navbar navLogoRef={navLogoRef} />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </SmoothScroll>
    </>
  );
}
