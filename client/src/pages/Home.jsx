import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="hero-bg min-h-screen">

      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-20">

        <FeatureCard
          title="📄 AI Summary"
          desc="Upload PDFs and get instant AI-powered summaries."
        />

        <FeatureCard
          title="🧠 Flashcards"
          desc="Generate smart flashcards for faster revision."
        />

        <FeatureCard
          title="❓ AI Quiz"
          desc="Practice with automatically generated MCQs."
        />

      </section>

      <Footer />

    </div>
  );
}