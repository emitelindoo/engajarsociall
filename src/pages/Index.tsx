import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PlatformPlans from "@/components/PlatformPlans";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FeedbackSection from "@/components/FeedbackSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <HowItWorks />
    <PlatformPlans />
    <Features />
    <Testimonials />
    <FAQ />
    <FeedbackSection />
    <Footer />
  </div>
);

export default Index;
