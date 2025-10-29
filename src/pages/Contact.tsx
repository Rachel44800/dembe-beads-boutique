import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Contact />
      </div>
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default ContactPage;

