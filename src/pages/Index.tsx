import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import PlatformPlans from "@/components/PlatformPlans";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FeedbackSection from "@/components/FeedbackSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <TrustBar />
    <HowItWorks />
    <PlatformPlans />
    <Features />
    <FeedbackSection />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
