import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, FilterX, SortAsc } from "lucide-react";
import { ModuleCard } from "@/components/courses/ModuleCard";
import { Link } from "react-router-dom";

// Dummy data for modules
const courseModules = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React, component structure, and JSX syntax.",
    progress: 100,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
    duration: "3 hours",
    lessonCount: 3,
    quizCount: 2,
    assignmentCount: 1,
    videoCount: 6,
    textCount: 4
  },
  {
    id: "2",
    title: "React Hooks & State Management",
    description: "Master React hooks for state and effects. Learn about context API and custom hooks.",
    progress: 65,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000",
    duration: "5 hours",
    lessonCount: 4,
    quizCount: 3,
    assignmentCount: 2,
    videoCount: 9,
    textCount: 7
  },
  {
    id: "3",
    title: "React Router & Navigation",
    description: "Implement client-side routing in React applications using React Router.",
    progress: 30,
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000",
    duration: "2.5 hours",
    lessonCount: 2,
    quizCount: 1,
    assignmentCount: 1,
    videoCount: 4,
    textCount: 3
  },
  {
    id: "4",
    title: "Forms & User Input",
    description: "Build and validate forms in React. Handle user inputs and form submissions.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000",
    duration: "4 hours",
    lessonCount: 3,
    quizCount: 2,
    assignmentCount: 2,
    videoCount: 8,
    textCount: 5
  },
  {
    id: "5",
    title: "API Integration & Data Fetching",
    description: "Connect React applications to backends and APIs. Implement data fetching strategies.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000",
    duration: "4.5 hours",
    lessonCount: 4,
    quizCount: 2,
    assignmentCount: 2,
    videoCount: 7,
    textCount: 6
  },
  {
    id: "6",
    title: "Testing React Applications",
    description: "Learn testing strategies for React components using Jest and React Testing Library.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000",
    duration: "3.5 hours",
    lessonCount: 3,
    quizCount: 1,
    assignmentCount: 1,
    videoCount: 5,
    textCount: 3
  }
];

function ModulesList() {
  // Animation effect when component mounts
  useEffect(() => {
    const moduleCards = document.querySelectorAll(".module-card");
    moduleCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses">
                <ChevronLeft size={16} />
                Back to courses
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Complete React Developer in 2023</h1>
              <p className="text-muted-foreground mt-1">
                Master React with hands-on projects and practical exercises
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <FilterX size={16} className="mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc size={16} className="mr-2" />
                Sort
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={18} />
            <h2 className="text-xl font-semibold">Course Modules</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModules.map((module) => (
              <div key={module.id} className="module-card opacity-0 transition-all duration-500 ease-in-out">
                <ModuleCard module={module} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModulesList;