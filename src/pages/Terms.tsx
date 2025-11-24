import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PolicyNav from "@/components/PolicyNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePageTitle } from "@/hooks/usePageTitle";

const Terms = () => {
  usePageTitle("Terms & Conditions");
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="bg-background py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-2">
              <Breadcrumbs />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-background">
          <div className="mb-4">
            <PolicyNav />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Terms & Conditions</h1>

          <section className="space-y-6 max-w-3xl mx-auto text-foreground">
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-muted-foreground">
              <li>Orders cannot be cancelled or changed after payment.</li>
              <li>Deliveries are handled by PAXI, PostNet; timelines depend on the option selected.</li>
              <li>Dembe Beads is not responsible for courier delays or incorrect customer information.</li>
              <li>Handle products gently to maintain quality and longevity.</li>
              <li>Double-check name, address, and branch details before confirming an order. We cannot be liable for parcels lost due to incorrect details.</li>
              <li>Delivery fees are non-refundable.</li>
            </ul>

            <p className="text-sm sm:text-base text-muted-foreground">
              By shopping with us, you acknowledge that you have read, understood, and agreed to these terms.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;


