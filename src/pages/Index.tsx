import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import PromotionalBanner from "@/components/PromotionalBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Hero />
      </div>
      <FeaturedProducts />
      <NewArrivals />
      <PromotionalBanner />
      <BestSellers />
      <Footer />
    </div>
  );
};

export default Index;
