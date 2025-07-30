import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CourseTimerContext = createContext();

export function useCourseTimer() {
  return useContext(CourseTimerContext);
}

export function CourseTimerProvider({ courseId, children }) {
  const location = useLocation();
  const [timeSpent, setTimeSpent] = useState(() => {
    // Always read the latest value from localStorage on mount
    const saved = localStorage.getItem(`course_time_${courseId}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const timerRef = useRef(null);

  // Helper to format seconds as HH:MM:SS
  function formatTime(secs) {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  // Always re-read the latest value from localStorage on mount and on location change
  useEffect(() => {
    const saved = localStorage.getItem(`course_time_${courseId}`);
    if (saved && parseInt(saved, 10) !== timeSpent) setTimeSpent(parseInt(saved, 10));
    // eslint-disable-next-line
  }, [courseId, location.pathname]);

  // Save time on unmount (always latest value)
  useEffect(() => {
    function stopTimer() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // Start timer
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          localStorage.setItem(`course_time_${courseId}`, newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    return () => {
      stopTimer();
      // Save the latest value
      localStorage.setItem(`course_time_${courseId}`, String(timeSpent));
    };
    // eslint-disable-next-line
  }, [courseId]);

  // Save time periodically (every 10s)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(`course_time_${courseId}`, timeSpent.toString());
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [courseId, timeSpent]);

  // Save time when tab is closed or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`course_time_${courseId}`, timeSpent.toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [courseId, timeSpent]);

  // Save time on route change (when leaving the course)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem(`course_time_${courseId}`, timeSpent.toString());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [courseId, timeSpent]);

  return (
    <CourseTimerContext.Provider value={{ timeSpent, formatTime }}>
      {children}
    </CourseTimerContext.Provider>
  );
} 