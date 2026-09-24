import type { Metadata } from "next";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import AreaTeaser from "@/components/sections/AreaTeaser";
import CtaBanner from "@/components/sections/CtaBanner";
import FaqSection from "@/components/sections/FaqSection";
import Hero from "@/components/sections/Hero";
import PriceFactors from "@/components/sections/PriceFactors";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ServicesGrid from "@/components/sections/ServicesGrid";
import TruckLoader from "@/components/sections/TruckLoader";
import WhyUs from "@/components/sections/WhyUs";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: `${site.name} | ${site.claim}`,
  description: site.description,
  alternates: pageAlternates("/"),
};

const teaserFaq = faq.slice(0, 5);

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid afterHero />
      <TruckLoader />
      <ProcessSteps />
      <WhyUs />
      <PriceFactors />
      <AreaTeaser />
      <FaqSection items={teaserFaq} withLink lead="Die Antworten, nach denen am häufigsten gefragt wird. Alles Weitere klären wir im Gespräch." />
      <CtaBanner />
      <FaqJsonLd items={teaserFaq} />
    </>
  );
}
