import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateCourse from "./CreateCourse";
import ScormPage from "./ScormPage";
import AddEvent from "./AddEvent";
import AddCatelog from "./AddCatelog";
import AddUsersForm from "./AddUsersPage";
import ManageUsers from "./ManageUsers";
import AddQuiz from "./AddQuiz";
import SupportTickets from "./Support";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

const InstructorPage = () => {
  const { isInstructorOrAdmin } = useAuth();
  const isAllowed = isInstructorOrAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("course");
  const [userManagementView, setUserManagementView] = useState(() => {
    const saved = localStorage.getItem("userManagementView");
    return saved || "add";
  });

  const collapsedWidth = "4.5rem";
  const expandedWidth = "17rem";
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
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
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
                  className="mt-4 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Go Back
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

      {/* Sub Sidebar with Header */}
      <div
        className="fixed top-0 h-screen z-20 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 overflow-y-auto"
        style={{
          left: collapsed ? collapsedWidth : expandedWidth,
          width: collapsed ? "0" : "13rem",
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
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "course" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📚 Course Management
          </button>
          <button 
            onClick={() => setActiveTab("users")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "users" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            👥 User Management
          </button>
          <button 
            onClick={() => setActiveTab("catalog")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "catalog" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📖 Course Catalog
          </button>
          <button 
            onClick={() => setActiveTab("quiz")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "quiz" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📝 Create Quiz
          </button>
          <button 
            onClick={() => setActiveTab("scorm")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "scorm" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📂 SCORM Content
          </button>
          <button 
            onClick={() => setActiveTab("events")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "events" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📅 Event Management
          </button>
          <button 
            onClick={() => setActiveTab("tickets")} 
            className={`text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === "events" 
                ? "bg-blue-100 text-blue-700 font-semibold" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📅 Support Tickets
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ 
          marginLeft: collapsed 
            ? `calc(${collapsedWidth} + ${!collapsed ? "13rem" : "0"})` 
            : `calc(${expandedWidth} + 13rem)`
        }}
      >
        <header
          className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 transition-all duration-300"
          style={{ 
            marginLeft: collapsed 
              ? `calc(${collapsedWidth} + ${!collapsed ? "13rem" : "0"})` 
              : `calc(${expandedWidth} + 13rem)`
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
                Manage your courses, users, SCORM, and more.
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      userManagementView === "add"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    ➕ Add Users
                  </button>
                  <button
                    onClick={() => setUserManagementView("manage")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      userManagementView === "manage"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    👥 Manage Users
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