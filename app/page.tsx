import Hero from "@/components/home/hero";
import SearchBar from "@/components/home/searchbar";
import QuickCategories from "@/components/home/QuickCategories";
import ExperienceDiscovery from "@/components/home/ExperienceDiscovery";
import NearYou from "@/components/home/NearYou";
import FeaturedPlaces from "@/components/home/featuredplace";
import WeekendDiscovery from "@/components/home/WeekendDiscovery";

export default function Home() {
 return (
  <main>
    <Hero />

    <SearchBar />

    <QuickCategories />

    <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-8 lg:grid-cols-[2fr_1fr] lg:gap-8">
      <FeaturedPlaces />
      <NearYou />
      <ExperienceDiscovery/>
    </div>
  </main>
);
}