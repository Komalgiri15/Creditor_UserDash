import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateCourse from "./CreateCourse";
import ScormPage from "./ScormPage";
import AddEvent from "./AddEvent";
import AddCatelog from "./AddCatelog";
import AddUsersForm from "./AddUsersPage";
import ManageUsers from "./ManageUsers";

import { allowedInstructorUserIds } from "@/data/allowedInstructorUsers";
import { currentUserId } from "@/data/currentUser";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";

const InstructorPage = () => {
  const { isInstructorOrAdmin } = useAuth();
  const isAllowed = isInstructorOrAdmin();
  const [showAddUsersForm, setShowAddUsersForm] = useState(false);
  const [userManagementView, setUserManagementView] = useState(() => {
    const saved = localStorage.getItem('userManagementView');
    return saved || "add";
  });
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Sidebar dimensions
  const collapsedWidth = "4rem";
  const expandedWidth = "16rem";

  // Save userManagementView to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userManagementView', userManagementView);
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
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? collapsedWidth : expandedWidth }}
      >
        {/* Header - fixed, shifts with sidebar */}
        <header
          className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 transition-all duration-300"
          style={{ marginLeft: collapsed ? collapsedWidth : expandedWidth }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <DashboardHeader sidebarCollapsed={collapsed} />
        </div>
        </header>
        {/* Scrollable content with padding top to avoid overlap */}
        <div className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto w-full px-6 pb-14 space-y-12 pt-6">
          {/* Dashboard Title */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your courses, content, and events
              </p>
          </section>

          {/* Course Creation */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Course Management
              </h2>
            </div>
            <div className="p-6">
              <CreateCourse />
            </div>
          </section>

          {/* User Management */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                User Management
              </h2>
                <div className="relative">
                  <select
                    value={userManagementView}
                    onChange={(e) => setUserManagementView(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                  >
                    <option value="add" className="py-2">➕ Add Users</option>
                    <option value="manage" className="py-2">👥 Manage Users</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              {userManagementView === "add" ? <AddUsersForm /> : <ManageUsers />}
            </div>
          </section>

          {/* Course Catalog */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
                Course Catalogs
              </h2>
            </div>
            <div className="p-6">
              <AddCatelog />
            </div>
          </section>

          {/* SCORM Content */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
                SCORM Content
              </h2>
            </div>
            <div className="p-6">
              <ScormPage />
            </div>
          </section>

          {/* Event Management */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
                Event Management
              </h2>
            </div>
            <div className="p-6">
              <AddEvent />
            </div>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPage;
