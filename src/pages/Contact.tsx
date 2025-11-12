import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Contact from "@/components/Contact";
import { usePageTitle } from "@/hooks/usePageTitle";

const ContactPage = () => {
  usePageTitle("Contact");
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <div className="bg-white py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-2">
              <Breadcrumbs />
            </div>
          </div>
        </div>
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

