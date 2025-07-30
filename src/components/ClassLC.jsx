import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import LiveClassBanner from "../assets/LiveClassBanner.png";

// Helper to convert a date to PST (America/Los_Angeles)
function toPST(date) {
  // Get UTC time in ms, then subtract 8 hours for PST offset
  // Note: This does not handle daylight saving time
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000) - (8 * 60 * 60000));
}

const ClassLC = () => {
  const bannerRef = useRef(null);
  const ctaRef = useRef(null);

  const bannerControls = useAnimation();
  const ctaControls = useAnimation();

  const bannerInView = useInView(bannerRef, { threshold: 0.3, once: false });
  const ctaInView = useInView(ctaRef, { threshold: 0.3, once: false });

  // Live class logic
  const [loading, setLoading] = useState(true);
  const [todayEvents, setTodayEvents] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    if (bannerInView) {
      bannerControls.start("visible");
    } else {
      bannerControls.start("hidden");
    }

    if (ctaInView) {
      ctaControls.start("visible");
    } else {
      ctaControls.start("hidden");
    }
  }, [bannerInView, ctaInView]);

  useEffect(() => {
    // Fetch today's live classes from backend
    const fetchLiveClasses = async () => {
      setLoading(true);
      try {
        const today = new Date();
        // Calculate start and end of day in PST
        const nowPST = toPST(new Date());
        const startOfDayPST = new Date(nowPST);
        startOfDayPST.setHours(0, 0, 0, 0);
        const endOfDayPST = new Date(nowPST);
        endOfDayPST.setHours(23, 59, 59, 999);
        const params = new URLSearchParams({ startDate: startOfDayPST.toISOString(), endDate: endOfDayPST.toISOString() });
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events?${params.toString()}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          // Filter events to only show classes for the current date in PST
          const events = data.data.filter(event => {
            if (!event.startTime) return false;
            const eventDate = toPST(new Date(event.startTime));
            return (
              eventDate.getFullYear() === startOfDayPST.getFullYear() &&
              eventDate.getMonth() === startOfDayPST.getMonth() &&
              eventDate.getDate() === startOfDayPST.getDate()
            );
          });
          setTodayEvents(events);

          // Find live events (current time between start and end in PST)
          const live = events.filter(event => {
            const start = toPST(new Date(event.startTime));
            const end = toPST(new Date(event.endTime));
            return nowPST >= start && nowPST <= end;
          });
          setLiveEvents(live);

          // Find the next upcoming event (start time in the future in PST)
          const upcoming = events
            .filter(event => toPST(new Date(event.startTime)) > nowPST)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          setNextEvent(upcoming[0] || null);
        } else {
          setTodayEvents([]);
          setLiveEvents([]);
          setNextEvent(null);
        }
      } catch (err) {
        setTodayEvents([]);
        setLiveEvents([]);
        setNextEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClasses();
  }, []);

  // Get user's timezone from localStorage, default to EST if not set
  const userTimezone = localStorage.getItem('userTimezone') || 'America/New_York';
  // Format time for display
  const formatTimeInUserTimezone = (utcTime) => {
    if (!utcTime) return '';
    const date = new Date(utcTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone
    });
  };

  return (
    <div className="w-full font-[Poppins]">
      {/* Banner Section */}
      <motion.div
        ref={bannerRef}
        initial="hidden"
        animate={bannerControls}
        variants={{
          hidden: { opacity: 0, scale: 1.05 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
        style={{
          position: "relative",
          maxWidth: "100%",
          height: "470px",
          overflow: "hidden",
        }}
      >
        <img
          src={LiveClassBanner}
          alt="Live Class Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>

      {/* Bottom CTA Section */}
      <motion.section
        ref={ctaRef}
        initial="hidden"
        animate={ctaControls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
          },
        }}
        style={{
          backgroundColor: "#eaf3f8",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          {loading ? "Checking for live classes..." :
            (liveEvents.length > 0 ? "Live Class is in Session!" : "Don't Miss Out on the Next Live Class!")}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Show Join Now for each live event */}
          {liveEvents.length > 0 && liveEvents.map((event, idx) => (
            <motion.a
              key={event.id || idx}
              href={event.description || event.zoomLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                textDecoration: "none",
                border: "none",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "30px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: 600,
              }}
            >
              Join Now: {event.title} ({formatTimeInUserTimezone(event.startTime)} - {formatTimeInUserTimezone(event.endTime)})
            </motion.a>
          ))}

          {/* If no live event, show next upcoming */}
          {liveEvents.length === 0 && nextEvent && (
            <div
              style={{
                backgroundColor: "#5dade2",
                color: "white",
                border: "none",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "30px",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              Next Class: {nextEvent.title} at {formatTimeInUserTimezone(nextEvent.startTime)}
            </div>
          )}

          {/* If no events at all */}
          {liveEvents.length === 0 && !nextEvent && !loading && (
            <div
              style={{
                backgroundColor: "#aaa",
                color: "white",
                border: "none",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "30px",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              No live or upcoming classes for today.
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default ClassLC;
