import SmoothScroll from "@/components/providers/SmoothScroll";
import StoryProvider from "@/components/story/StoryProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductStatement from "@/components/sections/ProductStatement";
import Intention from "@/components/sections/Intention";
import Notes from "@/components/sections/Notes";
import Offer from "@/components/sections/Offer";
import Closing from "@/components/sections/Closing";

export default function Page() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <StoryProvider>
          <Hero />
          <ProductStatement />
          <Intention />
          <Notes />
          <Offer />
        </StoryProvider>
        <Closing />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
