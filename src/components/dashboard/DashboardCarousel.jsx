import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Calendar, User, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const carouselItems = [
  {
    id: 1,
    title: "Welcome to Your Dashboard!",
    description: "Explore your personalized dashboard. Track your progress, manage your tasks, and stay updated with the latest features.",
    icon: User,
    type: 'profile',
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
    buttonText: "View Profile",
    buttonLink: "/profile"
  },
  {
    id: 2,
    title: "New Feature: Your Calendar ",
    description: "View your upcoming events and deadlines with the new integrated calendar. Stay organized and never miss an important date.",
    icon: Calendar,
    type: 'event',
    image: "https://i.pinimg.com/1200x/0b/0a/da/0b0ada13a45165cec43bdc91d2fe9028.jpg",
    buttonText: "Open Calendar",
    buttonLink: "/calendar"
  },
  {
    id: 3,
    title: "Explore the Course Catalog",
    description: "Browse all available courses and find new learning opportunities tailored to your interests.",
    icon: BookOpen,
    type: 'course',
    image: "https://i.pinimg.com/1200x/a0/15/f7/a015f7b1535d6bd8ce88d705cdcbd231.jpg",
    buttonText: "Browse Catalog",
    buttonLink: "/dashboard/catalog"
  },
  {
    id: 4,
    title: "Recent Improvements",
    description: "We’ve improved performance and squashed bugs for a smoother experience. Thank you for your feedback!",
    icon: BookOpen,
    type: 'course',
    image: "https://i.pinimg.com/736x/b5/3e/be/b53ebe5bb381adc4d177f2aa81b1a829.jpg",
    buttonText: "Learn More",
    buttonLink: "/updates"
  }
];

export function DashboardCarousel() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.click();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getItemColor = (type) => {
    switch (type) {
      case 'event': return 'from-blue-500 to-blue-700';
      case 'profile': return 'from-purple-500 to-purple-700';
      case 'notification': return 'from-amber-500 to-amber-700';
      case 'alert': return 'from-red-500 to-red-700';
      case 'course': return 'from-green-500 to-green-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <>
      <Carousel
        opts={{
          align: "center",
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent>
          {carouselItems.map((item) => {
            const Icon = item.icon;
            const gradientClass = getItemColor(item.type);
            const isRegisterItem = item.title.includes("Mock Trial");

            return (
              <CarouselItem key={item.id} className="md:basis-full">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} mix-blend-multiply opacity-50`} />
                  </div>

                  <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-white/20 mr-3">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                      <p className="text-lg opacity-90 max-w-[80%] line-clamp-3">{item.description}</p>
                    </div>

                    {/* {item.buttonText && (
                      <Button
                        variant="outline"
                        className="self-start bg-white/10 border-white/30 hover:bg-white/20 backdrop-blur text-white"
                        onClick={() => {
                          if (isRegisterItem) {
                            setShowRegisterModal(true);
                          } else {
                            window.location.href = item.buttonLink;
                          }
                        }}
                      >
                        {item.buttonText}
                      </Button>
                    )} */}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="flex justify-center gap-2 mt-3">
          <CarouselPrevious className="static transform-none translate-y-0 mr-2" />
          <CarouselNext ref={nextBtnRef} className="static transform-none translate-y-0" />
        </div>
      </Carousel>

      {/* Register Modal */}
      {/* <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Mock Trial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Full Name" />
            <Input type="email" placeholder="Email Address" />
            <Input type="tel" placeholder="Phone Number" />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRegisterModal(false)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default DashboardCarousel;
