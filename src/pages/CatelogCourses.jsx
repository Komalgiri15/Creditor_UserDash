import React from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";

// Dummy course data (should be shared or imported from a data file in a real app)
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
    category: "Design",
    level: "Beginner",
    duration: "22 hours",
    lessons: 36,
    instructor: "Michael Chen",
    price: 99.99
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

const CatelogCourses = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName || "");
  const filteredCourses = courses.filter(c => c.category === decodedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/catalog" className="text-blue-600 hover:underline text-sm">&larr; Back to Catalog</Link>
            <h1 className="text-2xl font-bold">{decodedCategory} Courses</h1>
          </div>
          {filteredCourses.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No courses found in this category.</div>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="flex flex-col md:flex-row gap-6 border rounded-lg p-4 bg-white shadow-sm">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full md:w-56 h-40 object-cover rounded-md border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{course.title}</h2>
                      <p className="text-gray-600 mb-2 text-sm">{course.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                        <span><Clock size={12} className="inline mr-1" />{course.duration}</span>
                        <span><BookOpen size={12} className="inline mr-1" />{course.lessons} lessons</span>
                        <Badge variant="outline">{course.level}</Badge>
                        <span>Instructor: {course.instructor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CatelogCourses;
