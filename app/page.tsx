import Hero from "@/components/home/hero";
import SearchBar from "@/components/home/searchbar";
import QuickCategories from "@/components/home/QuickCategories";
import ExperienceDiscovery from "@/components/home/ExperienceDiscovery";
import NearYou from "@/components/home/NearYou";
import FeaturedPlaces from "@/components/home/featuredplace";

export default function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      <Hero />

      <SearchBar />

      <QuickCategories />

      <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-6 px-4 md:px-8 lg:grid-cols-[2fr_1fr] lg:gap-8">
        <div className="min-w-0">
          <FeaturedPlaces />
        </div>

        <div className="min-w-0">
          <NearYou />
        </div>
      </div>

      <ExperienceDiscovery />
    </main>
  );
}