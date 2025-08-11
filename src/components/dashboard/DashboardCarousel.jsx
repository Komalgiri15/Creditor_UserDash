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
                <a href={item.link} className="block w-full">
                  <img
                    src={item.image}
                    alt={`Banner ${item.id}`}
                    className="w-full h-auto object-contain max-h-[400px] transition-transform duration-300"
                    style={{ minHeight: '200px' }}
                  />
                </a>
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
