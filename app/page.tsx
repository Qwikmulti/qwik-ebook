import Hero from "@/components/landing/Hero";
import RegistrationForm from "@/components/landing/RegistrationForm";
import BentoFeatures from "@/components/landing/BentoFeatures";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", overflowX: "hidden" }}>
      <Hero />
      <RegistrationForm />
      <BentoFeatures />
      <Testimonials />
      <Footer />
    </main>
  );
}
