import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateCourse from "./CreateCourse";
import ScormPage from "./ScormPage";
import CourseLessonsPage from "./CourseLessonsPage";
import AddEvent from "./AddEvent";
import AddCatelog from "./AddCatelog";
import AddUsersForm from "./AddUsersPage";
import ManageUsers from "./ManageUsers";
import AddQuiz from "./AddQuiz";
import SupportTickets from "./Support";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FaBook, 
  FaUsers, 
  FaBookOpen, 
  FaEdit, 
  FaFolder, 
  FaCalendarAlt,
  FaTicketAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaFileAlt
} from "react-icons/fa";

const InstructorPage = () => {
  const { isInstructorOrAdmin } = useAuth();
  const isAllowed = isInstructorOrAdmin();
  const [collapsed, setCollapsed] = useState(true); // Start with sidebar collapsed
  const [activeTab, setActiveTab] = useState("course");
  const [userManagementView, setUserManagementView] = useState(() => {
    const saved = localStorage.getItem("userManagementView");
    return saved || "add";
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("userManagementView", userManagementView);
  }, [userManagementView]);

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-yellow-50 border-l-8 border-yellow-400 p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 text-yellow-500">
                <FaExclamationTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-yellow-800 mb-1">
                  Access Restricted
                </h3>
                <p className="text-yellow-700">
                  This page is only accessible to authorized instructors or
                  admins. Please contact support if you believe this is an
                  error.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="mt-4 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <FaArrowLeft /> Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      {/* Main Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Sub Sidebar - Always show when on instructor page */}
      <div 
        className="fixed top-0 h-screen z-20 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 overflow-y-auto w-52"
        style={{
          left: collapsed ? "4.5rem" : "17rem"
        }}
      >
        {/* Sub Sidebar Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Instructor Tools</h2>
          <p className="text-xs text-gray-500">Manage your content</p>
        </div>

        {/* Sub Sidebar Navigation */}
        <div className="flex flex-col p-4 gap-3 text-sm">
          <button 
            onClick={() => setActiveTab("course")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "course" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaBook /> Course Management
          </button>
          <button 
            onClick={() => setActiveTab("users")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "users" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaUsers /> User Management
          </button>
          <button 
            onClick={() => setActiveTab("catalog")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "catalog" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaBookOpen /> Course Catalog
          </button>
          <button 
            onClick={() => setActiveTab("quiz")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "quiz" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaEdit /> Create Quiz
          </button>
          <button 
            onClick={() => setActiveTab("scorm")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "scorm" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaFolder /> SCORM Content
          </button>
          <button 
            onClick={() => setActiveTab("lessons")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "lessons" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaFileAlt /> Course Lessons
          </button>
          <button 
            onClick={() => setActiveTab("events")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "events" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaCalendarAlt /> Event Management
          </button>
          <button 
            onClick={() => setActiveTab("tickets")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "tickets" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FaTicketAlt /> Support Tickets
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ 
          marginLeft: collapsed ? "calc(4.5rem + 13rem)" : "calc(17rem + 13rem)"
        }}
      >
        <header
          className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 transition-all duration-300"
          style={{ 
            marginLeft: collapsed ? "calc(4.5rem + 13rem)" : "calc(17rem + 13rem)"
          }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <DashboardHeader sidebarCollapsed={collapsed} />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto w-full px-6 pb-14 pt-6">
            {/* Dashboard Header */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your courses, users, SCORM, lessons, and more.
              </p>
            </section>

            {/* Tabs Content */}
            {activeTab === "course" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <CreateCourse />
              </section>
            )}

            {activeTab === "users" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setUserManagementView("add")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      userManagementView === "add"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FaUsers /> Add Users
                  </button>
                  <button
                    onClick={() => setUserManagementView("manage")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      userManagementView === "manage"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FaUsers /> Manage Users
                  </button>
                </div>
                {userManagementView === "add" ? <AddUsersForm /> : <ManageUsers />}
              </section>
            )}

            {activeTab === "catalog" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AddCatelog />
              </section>
            )}

            {activeTab === "quiz" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AddQuiz />
              </section>
            )}

            {activeTab === "scorm" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ScormPage />
              </section>
            )}

            {activeTab === "lessons" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <CourseLessonsPage />
              </section>
            )}

            {activeTab === "events" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AddEvent />
              </section>
            )}
            {activeTab === "tickets" && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <SupportTickets />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPage;