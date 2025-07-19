import React, { useRef, useState } from "react";
import ProgressStats from "@/components/dashboard/ProgressStats";
import CourseCard from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, GraduationCap, Target, Clock, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCarousel from "@/components/dashboard/DashboardCarousel";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import DashboardTodo from "@/components/dashboard/DashboardTodo";
import MonthlyProgress from "@/components/dashboard/MonthlyProgress";
import DashboardAnnouncements from "@/components/dashboard/DashboardAnnouncements";
import LiveClasses from "@/components/dashboard/LiveClasses";

export function Dashboard() {
  const inProgressCourses = [
    {
      id: "1",
      title: "Constitutional Law Fundamentals",
      description: "Learn the essentials of US constitutional law including rights, powers, and judicial review.",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=1000",
      progress: 62,
      lessonsCount: 42,
      category: "Legal Studies",
      duration: "25 hours"
    },
    {
      id: "2",
      title: "Civil Litigation Procedure",
      description: "Master the procedures and strategies involved in civil litigation in American courts.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000",
      progress: 35,
      lessonsCount: 28,
      category: "Legal Practice",
      duration: "18 hours"
    },
    {
      id: "3",
      title: "Criminal Law and Procedure",
      description: "Study the principles of criminal law, defenses, and procedural requirements in the US justice system.",
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1000",
      progress: 78,
      lessonsCount: 36,
      category: "Criminal Justice",
      duration: "22 hours"
    }
  ];

  const recommendedCourses = [
    {
      id: "4",
      title: "Contract Law and Drafting",
      description: "Learn to analyze, interpret, and draft legally binding contracts under US law.",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1000",
      progress: 0,
      lessonsCount: 38,
      category: "Business Law",
      duration: "28 hours"
    },
    {
      id: "5",
      title: "Legal Research and Writing",
      description: "Develop essential skills for conducting legal research and preparing legal documents.",
      image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000",
      progress: 0,
      lessonsCount: 32,
      category: "Legal Skills",
      duration: "20 hours"
    }
  ];

  // Carousel state for My Courses
  const courseScrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCards = 2;
  const totalCards = inProgressCourses.length;

  const handleScroll = (direction) => {
    let newIndex = scrollIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > totalCards - visibleCards) newIndex = totalCards - visibleCards;
    setScrollIndex(newIndex);
    if (courseScrollRef.current) {
      const cardWidth = courseScrollRef.current.firstChild?.offsetWidth || 320;
      courseScrollRef.current.scrollTo({
        left: newIndex * (cardWidth + 24), // 24px gap
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          {/* Top grid section - align greeting with latest updates */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8 relative z-0">
            {/* Left section - greeting and latest updates */}
            <div className="xl:col-span-8 space-y-8">
              {/* Enhanced Greeting Section */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <div className="animate-gradient-shift absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10"></div>
                <div className="relative z-10 p-8 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="text-white" size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Welcome Back, Alex! 👋
                      </h2>
                      <p className="text-gray-600 text-lg">Continue your legal education journey and achieve your learning goals.</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <Target className="text-blue-600" size={20} />
                        <span className="text-blue-600 font-semibold">Current Goal</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700 mt-1">62%</p>
                      <p className="text-blue-600 text-sm">Course Completion</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Clock className="text-emerald-600" size={20} />
                        <span className="text-emerald-600 font-semibold">This Week</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">12h</p>
                      <p className="text-emerald-600 text-sm">Study Time</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-purple-600" size={20} />
                        <span className="text-purple-600 font-semibold">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 mt-1">3</p>
                      <p className="text-purple-600 text-sm">Courses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Courses Section (carousel with arrows) */}
              <div className="mb-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                  <Button variant="outline" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Link to="/courses" className="flex items-center gap-2">
                      View all courses
                      <ChevronRight size={16} />
                    </Link>
                  </Button>
                </div>
                {/* Carousel row with arrows */}
                <div className="relative">
                  {/* Left Arrow */}
                  {scrollIndex > 0 && (
                    <button
                      onClick={() => handleScroll(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full shadow-md p-2 hover:bg-blue-50 transition disabled:opacity-40"
                      style={{ marginLeft: '-24px' }}
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  {/* Cards Row */}
                  <div
                    ref={courseScrollRef}
                    className="flex gap-6 overflow-x-hidden scroll-smooth"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {inProgressCourses.map((course) => (
                      <div
                        key={course.id}
                        className="min-w-[320px] max-w-xs flex-shrink-0"
                      >
                        <CourseCard {...course} />
                      </div>
                    ))}
                  </div>
                  {/* Right Arrow */}
                  {scrollIndex < totalCards - visibleCards && (
                    <button
                      onClick={() => handleScroll(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full shadow-md p-2 hover:bg-blue-50 transition disabled:opacity-40"
                      style={{ marginRight: '-24px' }}
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
                </div>
              </div>

              {/* Latest Updates Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Latest Updates</h3>
                </div>
                <DashboardCarousel />
              </div>

              {/* Your Progress */}
              {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Progress Overview</h3>
                <ProgressStats />
              </div> */}

              {/* Monthly Overview */}
              {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Learning Analytics</h3>
                <MonthlyProgress />
              </div> */}
            </div>
            
            {/* Right section - enhanced sidebar widgets */}
            <div className="xl:col-span-4 space-y-6">
              {/* Announcements*/}
              {/*<div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Announcements</h3>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <DashboardAnnouncements />
              </div> */}

              {/* Calendar */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Calendar</h3>
                <div className="flex justify-center">
                  <DashboardCalendar />
                </div>
              </div>

              {/* Todo */}
              {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Tasks</h3>
                <DashboardTodo />
              </div> */}
            </div>
          </div>
          
          {/* Live Classes Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Classes Today</h2>
              <LiveClasses />
            </div>
          </div>
          
          {/* Recommended Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="transform transition-all duration-300 hover:scale-105">
                  <CourseCard {...course} />
                </div>
              ))}
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Explore More Courses</h3>
                <p className="text-gray-600 text-sm mb-6">Discover courses tailored to your legal education goals and career aspirations.</p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Link to="/catalog">
                    Browse Catalog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;