import React, { useRef, useState, useEffect } from "react";
import ProgressStats from "@/components/dashboard/ProgressStats";
import CourseCard from "@/components/dashboard/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, GraduationCap, Target, Clock, ChevronLeft, CheckCircle, Search, MonitorPlay, Award, Video } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCarousel from "@/components/dashboard/DashboardCarousel";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import DashboardTodo from "@/components/dashboard/DashboardTodo";
import MonthlyProgress from "@/components/dashboard/MonthlyProgress";
import DashboardAnnouncements from "@/components/dashboard/DashboardAnnouncements";
import LiveClasses from "@/components/dashboard/LiveClasses";
import axios from "axios";
import { fetchUserCourses, fetchCourseModules } from '../services/courseService';
import { useUser } from '@/contexts/UserContext';


export function Dashboard() {
  const { userProfile } = useUser();
  // Dashboard data structure based on backend getUserOverview endpoint
  // Expected response structure:
  // {
  //   summary: { activeCourses, completedCourses, totalLearningHours, averageProgress },
  //   weeklyPerformance: { studyHours, lessonsCompleted },
  //   monthlyProgressChart: [...],
  //   learningActivities: [...]
  // }
  // 
  // NOTE: Using the working endpoints from your backend:
  // - /api/course/getCourses - for user courses
  // - /api/user/getUserProfile - for user profile
  // 
  // The dashboard shows basic stats based on available data.
  // Progress tracking, time tracking, and detailed analytics will be added
  // when those features are implemented in the backend.
  const [dashboardData, setDashboardData] = useState({
    summary: {
      activeCourses: 0,
      completedCourses: 0,
      totalLearningHours: 0,
      averageProgress: 0
    },
    weeklyPerformance: {
      studyHours: 0,
      lessonsCompleted: 0
    },
    monthlyProgressChart: [],
    learningActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [userCourses, setUserCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [userCoursesMap, setUserCoursesMap] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://creditor-backend-9upi.onrender.com";
  // Get userId from localStorage or cookies, or fetch from profile
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const fetchUserOverview = async () => {
    try {
      setLoading(true);
      
      // Get userId - use from context if available, otherwise fetch from profile
      let currentUserId = userId;
      if (!currentUserId && userProfile) {
        currentUserId = userProfile.id;
        setUserId(currentUserId);
        localStorage.setItem('userId', currentUserId);
      } else if (!currentUserId) {
        currentUserId = await fetchUserProfile();
      }
      
      if (!currentUserId) {
        throw new Error('Unable to get user ID. Please log in again.');
      }
      
      // Use the working endpoints from your backend
      try {
        // console.log('🔍 Fetching user courses from:', `${API_BASE}/api/course/getCourses`);
        // console.log('👤 User ID:', currentUserId);
        
        // Get user courses using the correct endpoint - backend's HttpOnly token cookie will be automatically sent
        const userCoursesResponse = await axios.get(`${API_BASE}/api/course/getCourses`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        if (userCoursesResponse.data && userCoursesResponse.data.data) {
          const courses = userCoursesResponse.data.data;
          
          // Calculate basic dashboard stats from available data
          const activeCourses = courses.length;
          const completedCourses = 0; // Will be calculated when progress tracking is implemented
          const totalLearningHours = 0; // Will be calculated when time tracking is implemented
          const averageProgress = 0; // Will be calculated when progress tracking is implemented
          
                      const newDashboardData = {
              summary: {
                activeCourses,
                completedCourses,
                totalLearningHours,
                averageProgress
              },
              weeklyPerformance: {
                studyHours: 0, // Will be calculated when time tracking is implemented
                lessonsCompleted: activeCourses
              },
              monthlyProgressChart: [],
              learningActivities: []
            };
            
            setDashboardData(newDashboardData);
        } else {
          // No courses found, set default values
          setDashboardData({
            summary: {
              activeCourses: 0,
              completedCourses: 0,
              totalLearningHours: 0,
              averageProgress: 0
            },
            weeklyPerformance: {
              studyHours: 0,
              lessonsCompleted: 0
            },
            monthlyProgressChart: [],
            learningActivities: []
          });
        }
      } catch (coursesError) {
        console.error('❌ Failed to fetch user courses:', coursesError);
        console.error('❌ Error details:', {
          message: coursesError.message,
          status: coursesError.response?.status,
          data: coursesError.response?.data
        });
        // Set default values if endpoint fails
        setDashboardData({
          summary: {
            activeCourses: 0,
            completedCourses: 0,
            totalLearningHours: 0,
            averageProgress: 0
          },
          weeklyPerformance: {
            studyHours: 0,
            lessonsCompleted: 0
          },
          monthlyProgressChart: [],
          learningActivities: []
        });
      }
    } catch (err) {
      console.error('Error fetching user overview:', err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this data.');
      } else if (err.response?.status === 404) {
        setError('User data not found. Please contact support.');
      } else {
        setError(err.message || 'Failed to load dashboard data. Please try again.');
      }
      
      // Set default values if API fails
      setDashboardData({
        summary: {
          activeCourses: 0,
          completedCourses: 0,
          totalLearningHours: 0,
          averageProgress: 0
        },
        weeklyPerformance: {
          studyHours: 0,
          lessonsCompleted: 0
        },
        monthlyProgressChart: [],
        learningActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always try to fetch user overview - UserContext handles authentication
    fetchUserOverview();
  }, [userId]);

  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const data = await fetchUserCourses();
        // Fetch modules for each course and add modulesCount and totalDuration
        const coursesWithModules = await Promise.all(
          data.map(async (course) => {
            try {
              const modules = await fetchCourseModules(course.id);
              const modulesCount = modules.length;
              const totalDurationMins = modules.reduce((sum, m) => sum + (parseInt(m.estimated_duration, 10) || 0), 0);
              const totalDurationSecs = totalDurationMins * 60;
              return { 
                ...course, 
                modulesCount, 
                totalDurationSecs,
                // Ensure image field is set from thumbnail with proper fallbacks
                image: course.thumbnail || course.image || course.coverImage || course.course_image || course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              };
            } catch {
              return { 
                ...course, 
                modulesCount: 0, 
                totalDurationSecs: 0,
                // Ensure image field is set from thumbnail with proper fallbacks
                image: course.thumbnail || course.image || course.coverImage || course.course_image || course.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              };
            }
          })
        );
        setUserCourses(coursesWithModules);
      } catch (err) {
        setCoursesError('Failed to fetch courses');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Monitor dashboard data changes
  useEffect(() => {
  }, [dashboardData]);

  // Fetch user profile to get userId and userName if not available
  const fetchUserProfile = async () => {
    try {
      // Backend's HttpOnly token cookie will be automatically sent with the request
      const response = await axios.get(`${API_BASE}/api/user/getUserProfile`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data && response.data.data && response.data.data.id) {
        const userProfile = response.data.data;
        setUserId(userProfile.id);
        localStorage.setItem('userId', userProfile.id);
        // Set user name for welcome message
        const name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
        setUserName(name || userProfile.email || "User");
        return userProfile.id;
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      throw err;
    }
  };

  // Use userProfile from context to set user name
  useEffect(() => {
    if (userProfile) {
      const name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
      setUserName(name || userProfile.email || "User");
      setUserId(userProfile.id);
      localStorage.setItem('userId', userProfile.id);
    }
  }, [userProfile]);

  // Add retry functionality
  const handleRetry = () => {
    setError(null);
    fetchUserOverview();
  };

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
    },
    {
      id: "4",
      title: "Intellectual Property Law",
      description: "Explore copyright, trademark, and patent law with real-world case studies.",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1000",
      progress: 50,
      lessonsCount: 30,
      category: "IP Law",
      duration: "20 hours"
    },
    {
      id: "5",
      title: "Family Law Essentials",
      description: "Understand the basics of family law, including divorce, custody, and adoption.",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1000",
      progress: 20,
      lessonsCount: 18,
      category: "Family Law",
      duration: "12 hours"
    },
    {
      id: "6",
      title: "International Business Law",
      description: "Gain insights into cross-border transactions, trade regulations, and dispute resolution.",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1000",
      progress: 10,
      lessonsCount: 25,
      category: "Business Law",
      duration: "16 hours"
    }
  ];

  const recommendedCourses = [
    {
      id: "4",
      title: "Road Map Series",
      description: "Guides you through the essentials of private living, from sovereignty to business credit, with tools and expert support.",
      image: "https://static.vecteezy.com/system/resources/previews/036/115/246/non_2x/ai-generated-handsome-businessman-working-with-laptop-in-cafe-businessman-working-on-laptop-in-cafe-business-professional-working-on-laptop-in-office-lobby-ai-generated-free-photo.jpg",
      progress: 0,
      lessonsCount: 38,
      category: "Business Law",
      duration: "28 hours"
    },
    // {
    //   id: "5",
    //   title: "Legal Research and Writing",
    //   description: "Develop essential skills for conducting legal research and preparing legal documents.",
    //   image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000",
    //   progress: 0,
    //   lessonsCount: 32,
    //   category: "Legal Skills",
    //   duration: "20 hours"
    // }
  ];

  // Carousel state for My Courses
  const courseScrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCards = 2;
  const totalCards = userCourses.length;

  const handleScroll = (direction) => {
    let newIndex = scrollIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > totalCards - visibleCards) newIndex = totalCards - visibleCards;
    setScrollIndex(newIndex);
    if (courseScrollRef.current) {
      const cardWidth = courseScrollRef.current.firstChild?.offsetWidth || 320;
      const scrollAmount = newIndex * (cardWidth + 24); // 24px gap
      courseScrollRef.current.scrollTo({
        left: scrollAmount,
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
                <div className="relative z-10 p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="text-white" size={22} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {`Welcome back${userName ? `, ${userName}` : ''}!`}
                      </h2>
                      <p className="text-gray-600 text-base">Continue your private education journey and achieve your learning goals.</p>
                    </div>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-700 text-sm">Failed to load dashboard data</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRetry}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-blue-600" size={20} />
                        <span className="text-blue-600 font-semibold">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {loading ? (
                          <div className="animate-pulse bg-blue-200 h-8 w-12 rounded"></div>
                        ) : (
                          dashboardData.summary?.completedCourses || 0
                        )}
                      </p>
                      <p className="text-blue-600 text-sm">Courses finished</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <Clock className="text-emerald-600" size={20} />
                        <span className="text-emerald-600 font-semibold">This Week</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">
                        {loading ? (
                          <div className="animate-pulse bg-emerald-200 h-8 w-12 rounded"></div>
                        ) : (
                          `${dashboardData.weeklyPerformance?.studyHours || 0}h`
                        )}
                      </p>
                      <p className="text-emerald-600 text-sm">Study Time</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-purple-600" size={20} />
                        <span className="text-purple-600 font-semibold">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 mt-1">
                        {loading ? (
                          <div className="animate-pulse bg-purple-200 h-8 w-12 rounded"></div>
                        ) : (
                          dashboardData.summary?.activeCourses || 0
                        )}
                      </p>
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
                    <Link to="/dashboard/courses" className="flex items-center gap-2">
                      View all courses
                      <ChevronRight size={16} />
                    </Link>
                  </Button>
                </div>
                {/* Cards Row or Empty State */}
                {coursesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading courses...</p>
                    </div>
                  </div>
                ) : userCourses && userCourses.length > 0 ? (
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
                      className="flex gap-6 overflow-x-hidden scroll-smooth px-1"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {userCourses.map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[320px] max-w-xs flex-shrink-0"
                        >
                          <CourseCard {...course} />
                        </div>
                      ))}
                    </div>
                    {/* Right Arrow */}
                    {scrollIndex < userCourses.length - visibleCards && userCourses.length > visibleCards && (
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-lg font-medium mb-2">No courses enrolled</h3>
                    <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors duration-200"
                      onClick={() => window.location.href = '/dashboard/catalog'}
                    >
                      Click to view courses
                    </Button>
                  </div>
                )}
              </div>

              {/* Latest Updates Section */}
              {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Latest Updates</h3>
                </div>
                <DashboardCarousel />
              </div> */}

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
              {/* Catalog Banner Section */}
          <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <DashboardCarousel />
          </div>
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <MonitorPlay className="h-6 w-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-800">Learning Sessions</h2>
              </div>
              <LiveClasses />
            </div>
          </div>
          {/* How It Works Section */}
          <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Start your education journey in just three simple steps. Our platform makes learning accessible and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 min-h-[320px] flex flex-col justify-between">
                <div className="absolute -top-5 left-4 sm:left-6 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="font-bold">1</span>
                </div>
                <div className="flex flex-col items-center text-center pt-8 sm:pt-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-200 transition-all">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Choose a Course</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Browse our extensive catalog of private courses and select the one that matches your career goals.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-white p-4 sm:p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 min-h-[320px] flex flex-col justify-between">
                <div className="absolute -top-5 left-4 sm:left-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="font-bold">2</span>
                </div>
                <div className="flex flex-col items-center text-center pt-8 sm:pt-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-200 transition-all">
                    <MonitorPlay className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Learn Anytime</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Access high-quality video lectures, case studies, and interactive materials at your own pace.
                  </p>
                </div>
              </div>
              
              {/* Step 3 - Updated version without certification mention */}
              <div className="group relative bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300 min-h-[320px] flex flex-col justify-between">
                <div className="absolute -top-5 left-4 sm:left-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="font-bold">3</span>
                </div>
                <div className="flex flex-col items-center text-center pt-8 sm:pt-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-200 transition-all">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Master the Material</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Complete lessons, apply your knowledge with practical exercises, and track your progress.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8 sm:mt-10">
            </div>
          </div>

          {/* Live Classes Section */}
          
          
          {/* Upcoming Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Courses</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="transform transition-all duration-300 hover:scale-105">
                  <CourseCard {...course} isUpcoming={true} />
                </div>
              ))}
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Explore More Courses</h3>
                <p className="text-gray-600 text-sm mb-6">Discover courses tailored to your private education goals and career aspirations.</p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Link to="/dashboard/catalog">
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