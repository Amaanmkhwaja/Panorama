import { CTA } from "./_components/cta";
import { FAQ } from "./_components/faq";
import FeaturesAccordion from "./_components/features-accordion";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { TestimonialsGrid } from "./_components/testimonials-grid";
import { WithWithout } from "./_components/with-without";

export default async function Home() {
  return (
    <>
      <Hero />
      <WithWithout />
      <FeaturesAccordion />
      <Pricing />
      <TestimonialsGrid />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
