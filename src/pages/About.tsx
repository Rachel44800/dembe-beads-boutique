import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <About />
      </div>
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default AboutPage;

