import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import { useEffect, useRef } from "react";

const LandingPage = () => {
  const clientRef = useRef(null);

  useEffect(() => {
    // If URL has #client, scroll to the section
    if (window.location.hash === "#client" && clientRef.current) {
      clientRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      
      {/* About TalentFlow Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-0 text-center">
        Our <span className="text-primary"> Clients</span>
      </h2>

      {/* Company Logos Slider */}
      <section ref={clientRef} id="client">
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full py-4 relative" // Reduced vertical padding
        >
          <CarouselContent className="flex gap-5 sm:gap-20 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem
                key={id}
                className="basis-1/3 lg:basis-1/6 flex justify-center"
              >
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
};

export default LandingPage;
