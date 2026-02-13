import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProtocolOverview from "@/components/landing/ProtocolOverview";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProtocolOverview />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </>
  );
}
