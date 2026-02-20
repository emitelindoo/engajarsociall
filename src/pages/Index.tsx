import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import InstagramPlans from "@/components/InstagramPlans";
import TiktokPlans from "@/components/TiktokPlans";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <HowItWorks />
    <InstagramPlans />
    <TiktokPlans />
    <Features />
    <Testimonials />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
