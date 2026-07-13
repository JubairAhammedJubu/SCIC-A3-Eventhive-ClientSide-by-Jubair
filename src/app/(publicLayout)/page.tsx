import Hero from "@/components/pages/home/Hero";
import FeaturedEvents from "@/components/pages/home/FeaturedEvents";
import TopOrganizers from "@/components/pages/home/TopOrganizers";
import TrendingEvents from "@/components/pages/home/TrendingEvents";
import WhyChooseUs from "@/components/pages/home/WhyChooseUs";
import Testimonials from "@/components/pages/home/Testimonials";
import Categories from "@/components/pages/home/Categories";
import Newsletter from "@/components/pages/home/Newsletter";
import FAQ from "@/components/pages/home/FAQ";
import CTA from "@/components/pages/home/CTA";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedEvents />
      <div className="bg-gray-50 dark:bg-gray-950">
        <TopOrganizers />
      </div>
      <TrendingEvents />
      <div className="bg-gray-50 dark:bg-gray-950">
        <WhyChooseUs />
      </div>
      <Testimonials />
      <Categories />
      <Newsletter />
      <FAQ />
      <CTA />
    </div>
  );
}
