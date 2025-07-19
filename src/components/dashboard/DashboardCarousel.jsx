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
    title: "Mock Trial Competition",
    description: "Join our prestigious Mock Trial Competition next week. Register by Friday to secure your participation.",
    icon: Calendar,
    type: 'event',
    image: "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?q=80&w=1000",
    buttonText: "Register Now",
    buttonLink: "/events"
  },
  {
    id: 2,
    title: "Complete Your Profile",
    description: "Add your certifications and specialized legal fields of interest to get personalized course recommendations.",
    icon: User,
    type: 'profile',
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
    buttonText: "Update Profile",
    buttonLink: "/profile"
  },
  {
    id: 3,
    title: "New Course: Corporate Law",
    description: "Our new comprehensive course on Corporate Law taught by leading industry professionals is now available.",
    icon: BookOpen,
    type: 'course',
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1000",
    buttonText: "View Course",
    buttonLink: "/courses"
  },
  {
    id: 4,
    title: "Bar Exam Preparation",
    description: "The platform will be updating our Bar Exam preparation materials next week. Complete your current modules before the update.",
    icon: AlertCircle,
    type: 'alert',
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000",
    buttonText: "Learn More",
    buttonLink: "/courses"
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
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} mix-blend-multiply opacity-80`} />
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

                    {item.buttonText && (
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
                    )}
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
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
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
      </Dialog>
    </>
  );
}

export default DashboardCarousel;
