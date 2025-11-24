import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PolicyNav from "@/components/PolicyNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import { usePageTitle } from "@/hooks/usePageTitle";

const Shipping = () => {
  usePageTitle("Shipping & Payment");
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4">Shipping & Payment Info</h1>

          <section className="space-y-6 max-w-3xl mx-auto text-foreground">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">Shipping & Delivery</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                All orders require full payment upfront before processing. Once payment is confirmed, your order enters
                a 2–7 business day processing period (excluding weekends and holidays).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Delivery options</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
                <li>PAXI (Pep Stores, Shoe City, Tekkie Town)</li>
                <li>7–9 business days: R70</li>
                <li>3–5 business days: R120</li>
                <li>3–5 business days (store to door): R140</li>
                <li>PostNet (postnet to postnet): R110</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How to collect a PAXI parcel</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm sm:text-base text-muted-foreground">
                <li>Receive an SMS with a one-time collection PIN.</li>
                <li>Bring your ID and PIN to the specified PAXI point.</li>
                <li>Parcel will be scanned and ready for collection.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Lost Parcel</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Call 086 000 7294 within 14 days with your voucher and parcel number.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                PAXI insurance covers up to R500. Optional insurance vouchers are available:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-muted-foreground mt-1">
                <li>R10 → up to R2,500 cover</li>
                <li>R20 → up to R5,000 cover</li>
              </ul>
            </div>

            <div className="text-sm sm:text-base text-muted-foreground">
              <strong className="text-foreground">Please note:</strong> once your parcel is handed to the courier,
              Dembe Beads is not responsible for damage or loss.
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;


