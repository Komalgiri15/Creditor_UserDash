import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Calendar, 
  UserCircle2, 
  GraduationCap,
  CheckCircle,
  CreditCard
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Sample course data with faculty and units information
const coursesData = [
  {
    id: "1",
    title: "Complete React Developer in 2023",
    description: "Learn React with Redux, Hooks, GraphQL from industry experts. Build real projects.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
    category: "Web Development",
    level: "Intermediate",
    duration: "25 hours",
    lessons: 42,
    instructor: "John Smith",
    price: 89.99,
    faculty: [
      {
        name: "John Smith",
        title: "Senior React Developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000"
      },
      {
        name: "Sarah Johnson",
        title: "UX/UI Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"
      }
    ],
    units: [
      {
        title: "React Fundamentals",
        description: "Learn core React concepts and JSX",
        lessons: 10
      },
      {
        title: "State and Props",
        description: "Master component state and props passing",
        lessons: 8
      },
      {
        title: "Hooks in Depth",
        description: "Deep dive into React hooks",
        lessons: 12
      },
      {
        title: "Building Real Apps",
        description: "Apply your knowledge in real-world projects",
        lessons: 12
      }
    ]
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    description: "Master advanced JavaScript concepts: prototypal inheritance, closures, and more.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000",
    category: "Programming",
    level: "Advanced",
    duration: "18 hours",
    lessons: 28,
    instructor: "Sarah Johnson",
    price: 79.99,
    faculty: [
      {
        name: "Sarah Johnson",
        title: "JavaScript Expert",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"
      }
    ],
    units: [
      {
        title: "ES6+ Features",
        description: "Modern JavaScript syntax and features",
        lessons: 7
      },
      {
        title: "Closures and Scope",
        description: "Understanding JavaScript scope and closures",
        lessons: 5
      },
      {
        title: "Prototypes and Classes",
        description: "Deep dive into JS object system",
        lessons: 8
      },
      {
        title: "Async JavaScript",
        description: "Promises, async/await, and event loop",
        lessons: 8
      }
    ]
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces and improve user experiences for web applications.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000",
    category: "Design",
    level: "Beginner",
    duration: "22 hours",
    lessons: 36,
    instructor: "Michael Chen",
    price: 99.99,
    faculty: [
      {
        name: "Michael Chen",
        title: "UX Design Lead",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000"
      },
      {
        name: "Emma Davis",
        title: "UI Designer",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000"
      }
    ],
    units: [
      {
        title: "Design Principles",
        description: "Core principles of effective design",
        lessons: 8
      },
      {
        title: "User Research",
        description: "Techniques for understanding user needs",
        lessons: 7
      },
      {
        title: "Wireframing & Prototyping",
        description: "Create mockups and interactive prototypes",
        lessons: 10
      },
      {
        title: "User Testing",
        description: "Validate designs with real users",
        lessons: 6
      },
      {
        title: "Design Systems",
        description: "Build scalable design systems",
        lessons: 5
      }
    ]
  },
  {
    id: "4",
    title: "Node.js Complete Guide",
    description: "Build complete backend solutions with Node.js, Express, and MongoDB.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
    category: "Backend",
    level: "Intermediate",
    duration: "28 hours",
    lessons: 38,
    instructor: "David Wilson",
    price: 94.99,
    faculty: [
      {
        name: "David Wilson",
        title: "Backend Developer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000"
      }
    ],
    units: [
      {
        title: "Node.js Fundamentals",
        description: "Core concepts of Node.js",
        lessons: 8
      },
      {
        title: "Express.js Framework",
        description: "Build web applications with Express",
        lessons: 10
      },
      {
        title: "MongoDB Integration",
        description: "Working with MongoDB and Mongoose",
        lessons: 12
      },
      {
        title: "Authentication & Authorization",
        description: "Implement secure user authentication",
        lessons: 8
      }
    ]
  },
  {
    id: "5",
    title: "TypeScript Fundamentals",
    description: "Learn TypeScript from basics to advanced concepts with practical examples.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
    category: "Programming",
    level: "Beginner",
    duration: "20 hours",
    lessons: 32,
    instructor: "Emma Davis",
    price: 69.99,
    faculty: [
      {
        name: "Emma Davis",
        title: "TypeScript Specialist",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000"
      },
      {
        name: "Alex Turner",
        title: "Senior Developer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000"
      }
    ],
    units: [
      {
        title: "TypeScript Basics",
        description: "Introduction to TypeScript types",
        lessons: 8
      },
      {
        title: "Interfaces & Types",
        description: "Define complex types and interfaces",
        lessons: 7
      },
      {
        title: "Functions & Classes",
        description: "Object-oriented programming in TypeScript",
        lessons: 9
      },
      {
        title: "Advanced Types",
        description: "Generics, unions, and utility types",
        lessons: 8
      }
    ]
  }
];

function CourseEnrollment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const foundCourse = coursesData.find(c => c.id === courseId);
      setCourse(foundCourse || null);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [courseId]);

  const handleEnroll = () => {
    // Show payment processing state
    setIsProcessingPayment(true);
    toast.info("Processing payment...", {
      description: "Please wait while we process your payment"
    });

    // Simulate payment process with a 50% chance of success
    setTimeout(() => {
      const paymentSuccessful = Math.random() > 0.5;
      
      if (paymentSuccessful) {
        // Navigate to success page on successful payment
        navigate(`/payment-success/${courseId}`);
      } else {
        // Navigate to failure page on failed payment
        navigate(`/payment-failed/${courseId}`);
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex justify-center my-12">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="text-center my-12">
              <h2 className="text-2xl font-bold mb-3">Course Not Found</h2>
              <p className="text-muted-foreground mb-6">The course you are looking for does not exist.</p>
              <Button onClick={() => navigate("/catalog")}>Back to Catalog</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/catalog")} 
            className="mb-6"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Catalog
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full aspect-video object-cover"
                />
              </div>

              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="px-3 py-1">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {course.level}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpen size={16} />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              <Tabs defaultValue="content" className="mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <BookOpen size={20} /> Course Units
                    </h2>
                    
                    {course.units.map((unit, index) => (
                      <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{unit.title}</h3>
                              <p className="text-sm text-muted-foreground">{unit.description}</p>
                            </div>
                            <Badge variant="outline">
                              {unit.lessons} lessons
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="faculty">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <GraduationCap size={20} /> Meet Your Instructors
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.faculty.map((instructor, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden">
                              <img 
                                src={instructor.image} 
                                alt={instructor.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{instructor.name}</h3>
                              <p className="text-sm text-muted-foreground">{instructor.title}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Student Reviews</h2>
                    <div className="text-center py-10 bg-accent/20 rounded-lg">
                      <p className="text-muted-foreground">Reviews will be available after enrollment</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">${course.price}</h2>
                    <p className="text-muted-foreground text-sm mb-6">Full course access</p>
                    
                    <Button 
                      onClick={handleEnroll} 
                      className="w-full text-lg py-6"
                      size="lg"
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" /> Enroll Now
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">This course includes:</h3>
                    
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" />
                        <span>{course.lessons} lessons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span>{course.duration} of content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <UserCircle2 size={16} className="text-primary" />
                        <span>{course.faculty.length} instructor{course.faculty.length > 1 ? 's' : ''}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-xs text-center text-muted-foreground">
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseEnrollment;