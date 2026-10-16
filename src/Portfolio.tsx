import "./index.css";
import { useEffect } from "react";
import { initMotion } from "./lib/motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MissionCard from "./components/MissionCard";
import Services from "./components/Services";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Portfolio() {
  useEffect(() => {
    const cleanup = initMotion();
    return () => cleanup();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-[1440px] space-y-6">
        <Navbar />
        <Hero />
        <MissionCard />
        <Services />
        <Work />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
