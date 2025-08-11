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

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.click();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-full">
              <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
                <div className="block w-full cursor-default select-none">
                  <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
                    <img
                      src={item.image}
                      alt={`Banner ${item.id}`}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 select-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Overlay arrows: hidden by default, visible on hover */}
        <CarouselPrevious
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border border-gray-300 rounded-full shadow p-2"
        />
        <CarouselNext
          ref={nextBtnRef}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border border-gray-300 rounded-full shadow p-2"
        />
      </Carousel>
    </div>
  );
}

export default DashboardCarousel;
