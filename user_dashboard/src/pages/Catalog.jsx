import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
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
    price: 89.99
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
    price: 79.99
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces and improve user experiences for web applications.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000",
    
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
    price: 94.99
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
    price: 69.99
  }
];

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = Array.from(new Set(courses.map(course => course.category)));
  const levels = Array.from(new Set(courses.map(course => course.level)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Course Catalog</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px]"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all">
              <div className="aspect-video w-full relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <Badge 
                  className="absolute top-2 right-2"
                  variant="secondary"
                >
                  {course.category}
                </Badge>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>

                <Button className="w-full mt-2" asChild>
                  <Link to={`/catalog/category/${encodeURIComponent(course.category)}`}>
                    Explore
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CatalogPage;