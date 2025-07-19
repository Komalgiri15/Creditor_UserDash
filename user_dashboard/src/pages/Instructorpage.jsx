import React from "react";
import CreateCourse from "./CreateCourse";
import ScormPage from "./ScormPage";
import AddEvent from "./AddEvent";
import { allowedInstructorUserIds } from "@/data/allowedInstructorUsers";
import { currentUserId } from "@/data/currentUser";

const InstructorPage = () => {
  const isAllowed = allowedInstructorUserIds.includes(currentUserId);

  if (!isAllowed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This page is only accessible to authorized instructors.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-15xl mx-auto px-6 py-8 space-y-12">
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>
        <CreateCourse />
      </section>
      
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">SCORM Content Management</h2>
        </div>
        <ScormPage />
      </section>
      
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Calendar & Events</h2>
        </div>
        <AddEvent />
      </section>
    </div>
  );
};

export default InstructorPage;