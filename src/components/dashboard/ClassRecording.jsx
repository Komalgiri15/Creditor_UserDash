import React, { useEffect, useState } from "react";
import { Video, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchUserCourses } from "@/services/courseService";

// Course IDs provided for recordings
const COURSE_IDS = {
  becomePrivate: "a188173c-23a6-4cb7-9653-6a1a809e9914",
  operatePrivate: "7b798545-6f5f-4028-9b1e-e18c7d2b4c47",
  businessCredit: "199e328d-8366-4af1-9582-9ea545f8b59e",
  privateMerchant: "d8e2e17f-af91-46e3-9a81-6e5b0214bc5e",
  sovereignty101: "d5330607-9a45-4298-8ead-976dd8810283",
};

export default function ClassRecording() {
  const navigate = useNavigate();

  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserCourses = async () => {
      try {
        const courses = await fetchUserCourses();
        const ids = new Set((courses || []).map((c) => c.id));
        setEnrolledCourseIds(ids);
      } catch (e) {
        // Fail silently; no cards will show if we cannot determine enrollment
        setEnrolledCourseIds(new Set());
      } finally {
        setLoading(false);
      }
    };
    loadUserCourses();
  }, []);

  const goToCourseModules = (courseId) => {
    navigate(`/dashboard/courses/${courseId}/modules`);
  };

  const cards = [
    {
      courseId: COURSE_IDS.becomePrivate,
      title: "Become Private Recordings",
      description:
        "Access on‑demand recordings focused on becoming private. Rewatch sessions anytime to reinforce key concepts.",
      action: () => goToCourseModules(COURSE_IDS.becomePrivate),
      actionText: "Watch Now",
    },
    {
      courseId: COURSE_IDS.operatePrivate,
      title: "Operate Private Recordings",
      description:
        "Gain exclusive access to Operate Private sessions for focused, on‑demand learning.",
      action: () => goToCourseModules(COURSE_IDS.operatePrivate),
      actionText: "Watch Now",
    },
    {
      courseId: COURSE_IDS.businessCredit,
      title: "Business Credit Recordings",
      description:
        "Explore recordings that walk through building and managing business credit the right way.",
      action: () => goToCourseModules(COURSE_IDS.businessCredit),
      actionText: "Watch Now",
    },
    {
      courseId: COURSE_IDS.privateMerchant,
      title: "Private Merchant Recordings",
      description:
        "Dive into private merchant recordings to master operations, compliance, and best practices.",
      action: () => goToCourseModules(COURSE_IDS.privateMerchant),
      actionText: "Watch Now",
    },
    {
      courseId: COURSE_IDS.sovereignty101,
      title: "Sovereignty 101 Recordings",
      description:
        "Explore the fundamental principles of digital sovereignty through comprehensive session recordings.",
      action: () => goToCourseModules(COURSE_IDS.sovereignty101),
      actionText: "Watch Now",
    },
  ];

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto">
      <div className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-800">
        <Video className="h-6 w-6 text-purple-500" />
        Class Recordings
      </div>
      <p className="text-gray-500 mt-1">Access past sessions at your convenience</p>

      {/* Recordings list gated by enrollment */}
      <div className="mt-6 space-y-6">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center text-sm text-gray-600">
            Loading your eligible recordings...
          </div>
        ) : (
          cards
            .filter((card) => enrolledCourseIds.has(card.courseId))
            .map((card) => (
              <div key={card.courseId} className="bg-[#f8f9ff] border-2 border-[#e4e4fb] rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-1 items-start sm:items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-700">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{card.description}</p>
                    </div>
                  </div>
                  <div className="sm:self-center">
                    <button
                      onClick={card.action}
                      className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-md w-full sm:w-auto text-center"
                    >
                      {card.actionText}
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}

        {/* If none matched */}
        {!loading &&
          cards.filter((c) => enrolledCourseIds.has(c.courseId)).length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center text-sm text-gray-600">
              No eligible recordings available for your enrolled courses yet.
            </div>
          )}
      </div>

      {/* Sovereignty 101 section (temporarily disabled) */}
      {/**
      <div className="mt-6 bg-[#f8f9ff] border-2 border-[#e4e4fb] rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-start sm:items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full text-purple-700">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sovereignty 101 Recordings</h3>
              <p className="text-gray-600 text-sm mt-1">
                Explore the fundamental principles of digital sovereignty through this comprehensive session recording.
              </p>
            </div>
          </div>
          <div className="sm:self-center">
            <a
              href="#"
              className="inline-block bg-[#6b5cff] hover:bg-[#5b4bde] text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-md w-full sm:w-auto text-center"
            >
              Coming Soon
            </a>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
