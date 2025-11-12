import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PolicyNav from "@/components/PolicyNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePageTitle } from "@/hooks/usePageTitle";

const Privacy = () => {
  usePageTitle("Privacy Policy");
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-2">
            <Breadcrumbs />
          </div>
          <div className="mb-4">
            <PolicyNav />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Privacy Policy</h1>

          <section className="space-y-6 max-w-3xl mx-auto text-foreground">
            <p className="text-sm sm:text-base text-muted-foreground">
              At Dembe Beads, your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Name, email, shipping address, phone number, payment details, and purchase history.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
                <li>Process and fulfill orders</li>
                <li>Communicate about orders and promotions</li>
                <li>Improve website and customer experience</li>
                <li>Marketing emails (with your consent)</li>
                <li>Customer support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3. Sharing Your Information</h3>
              <p className="text-sm sm:text-base text-muted-foreground">We do not sell or rent your data. We may share with trusted partners for payment processing, shipping, and email services.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4. Your Rights</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Access, correct, or delete personal information; opt out of marketing.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">5. Cookies</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Cookies enhance your experience. You can manage them in your browser settings.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">6. Contact</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Email: dembemandavha@gmail.com | Phone: +27 79 363 7793</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;


