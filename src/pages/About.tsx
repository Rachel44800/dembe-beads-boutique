import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import About from "@/components/About";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;

