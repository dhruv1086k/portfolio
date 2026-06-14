import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollProgress from "../components/common/ScrollProgress";
import SmoothScroll from "../components/common/SmoothScroll";

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

  return (
    <SmoothScroll>
      <ScrollProgress />
      <Navbar />
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
  );
}
