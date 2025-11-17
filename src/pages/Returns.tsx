import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PolicyNav from "@/components/PolicyNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePageTitle } from "@/hooks/usePageTitle";

const Returns = () => {
  usePageTitle("Returns & Refunds");
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      <Navigation />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-2">
              <Breadcrumbs />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
          <div className="mb-4">
            <PolicyNav />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Return & Refund Policy</h1>

          <section className="space-y-6 max-w-3xl mx-auto text-foreground">
            <p className="text-sm sm:text-base text-muted-foreground">
              Due to hygiene and safety reasons, we do not accept returns, refunds, or exchanges once a product is packaged or shipped.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Refunds or exchanges are only offered if:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
                <li>You received the wrong item, or</li>
                <li>The item was damaged or defective upon arrival.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Claim Process</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
                <li>Contact us within 3 days of delivery via WhatsApp or email.</li>
                <li>Provide an unboxing video and clear photos of the product and packaging.</li>
                <li>The product must be unworn, uncut, and in original condition.</li>
              </ol>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground">
              Non-returnable items include opened or used hair/bead products, sale/promotional items, and custom-made orders. Shipping fees are non-refundable.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;


