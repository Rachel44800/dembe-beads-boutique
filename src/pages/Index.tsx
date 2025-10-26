import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <section id="products">
        <ProductGrid />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default Index;
