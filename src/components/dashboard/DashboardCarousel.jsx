import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const carouselItems = [
  {
    id: 1,
    image: "https://lesson-banners.s3.us-east-1.amazonaws.com/Dashboard-banners/Become+%2B+SOV.png",
    link: "/banner1"
  },
  {
    id: 2,
    image: "https://lesson-banners.s3.us-east-1.amazonaws.com/Dashboard-banners/Private+business.png",
    link: "/banner2"
  },
  {
    id: 3,
    image: "https://lesson-banners.s3.us-east-1.amazonaws.com/Dashboard-banners/masterclass.jpg",
    link: "/banner3"
  },
  {
    id: 4,
    image: "https://lesson-banners.s3.us-east-1.amazonaws.com/Dashboard-banners/Operate+Private.png",
    link: "/banner4"
  }
];

export function DashboardCarousel() {
  const nextBtnRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.click();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="group relative w-full max-w-4xl mx-auto">
      {/* Subtle decorative border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 p-[2px] pointer-events-none">
        <div className="w-full h-full rounded-2xl bg-white"></div>
      </div>
      
      <Carousel
        opts={{
          align: "center",
          loop: true
        }}
        className="w-full relative z-10"
        onSlideChange={handleSlideChange}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={item.id} className="md:basis-full">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                <div className="block w-full cursor-pointer select-none transform transition-all duration-500 hover:scale-[1.02]">
                  <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                    <img
                      src={item.image}
                      alt={`Banner ${item.id}`}
                      loading="lazy"
                      draggable={false}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 select-none ${
                        item.id === 1 ? 'object-top' : 'object-center'
                      }`}
                    />
                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Subtle corner accent */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Enhanced navigation arrows */}
        <CarouselPrevious
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-full shadow-lg hover:shadow-xl p-3 w-12 h-12 backdrop-blur-sm hover:scale-110"
        />
        <CarouselNext
          ref={nextBtnRef}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-full shadow-lg hover:shadow-xl p-3 w-12 h-12 backdrop-blur-sm hover:scale-110"
        />

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => {
                // This would need to be connected to the carousel API
                // For now, it's just visual
              }}
            />
          ))}
        </div>

        {/* Subtle gradient overlays for better text readability */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </Carousel>
      
      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent rounded-full"></div>
    </div>
  );
}

export default DashboardCarousel;
