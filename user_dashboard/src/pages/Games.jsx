import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import GameDetailView from "@/components/games/GameDetailView";

function Games() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const freshmanScrollContainerRef = useRef(null);
  const remedyScrollContainerRef = useRef(null);
  const juniorScrollContainerRef = useRef(null);
  const lmsScrollContainerRef = useRef(null);
  const merchantScrollContainerRef = useRef(null);
  const seniorScrollContainerRef = useRef(null);
  
  const sophomoreRef = useRef(null);
  const freshmanRef = useRef(null);
  const remedyRef = useRef(null);
  const juniorRef = useRef(null);
  const lmsRef = useRef(null);
  const merchantRef = useRef(null);
  const seniorRef = useRef(null);
  
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showFreshmanScrollButtons, setShowFreshmanScrollButtons] = useState(false);
  const [showRemedyScrollButtons, setShowRemedyScrollButtons] = useState(false);
  const [showJuniorScrollButtons, setShowJuniorScrollButtons] = useState(false);
  const [showLmsScrollButtons, setShowLmsScrollButtons] = useState(false);
  const [showMerchantScrollButtons, setShowMerchantScrollButtons] = useState(false);
  const [showSeniorScrollButtons, setShowSeniorScrollButtons] = useState(false);
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);
  
  const games = [
    {
      id: 1,
      title: "SOPHOMORE: BECOME PRIVATE",
      description: "Master the fundamentals of private law and learn how to establish your private status. Discover the key principles of operating as a private individual in commerce and law.",
      image: "/lovable-Uploads/ba4bfcb8-697b-439b-8f6f-3380ba7e01f0.png",
      sectionRef: sophomoreRef
    },
    {
      id: 2,
      title: "LMS NAVIGATION TUTORIALS",
      description: "Learn to navigate through our comprehensive learning management system. Get familiar with all the tools and features available to maximize your learning experience.",
      image: "/lovable-Uploads/0e00f85c-5155-47fc-bde8-320aac447afc.png",
      sectionRef: lmsRef
    },
    {
      id: 3,
      title: "PRIVATE MERCHANT PROCESSING COURSE",
      description: "Understand the intricacies of private merchant processing and payment systems. Learn how to set up and manage your own private processing solutions.",
      image: "/lovable-Uploads/4e4abbdf-182e-4a09-8c2d-0ecb8f1dcc64.png",
      sectionRef: merchantRef
    },
    {
      id: 4,
      title: "SENIOR: BUILD UNLIMITED CREDIT",
      description: "Advanced strategies for building and maintaining unlimited credit capacity. Learn the sophisticated techniques used by financial experts to maximize credit potential.",
      image: "/lovable-Uploads/7646d2fe-5328-40ea-bb94-91a5e96c9a54.png",
      sectionRef: seniorRef
    },
    {
      id: 5,
      title: "JUNIOR: OPERATE PRIVATE",
      description: "Essential skills for operating privately in today's commercial world. Learn the foundational concepts and practical applications of private operations.",
      image: "/lovable-Uploads/175d4827-74c2-44a7-adb0-368c8ce9b2aa.png",
      sectionRef: juniorRef
    },
    {
      id: 6,
      title: "FRESHMAN: NEW SOV 101",
      description: "Introduction to sovereignty and your rights as a sovereign individual. Perfect for beginners starting their journey into private law and sovereignty.",
      image: "/lovable-Uploads/c82f6675-e054-4d5c-addf-bdd37f546c28.png",
      sectionRef: freshmanRef
    },
    {
      id: 7,
      title: "I WANT REMEDY NOW!",
      description: "Immediate solutions and remedies for urgent legal and financial situations. Fast-track your way to resolving pressing issues with proven strategies.",
      image: "/lovable-Uploads/88c926e1-03b5-4fd2-bfb4-8e5e3c045907.png",
      sectionRef: remedyRef
    }
  ];

  const lessons = [
    {
      id: 1,
      title: "Is there a really remedy?",
      overlayTitle: "Is there a really remedy?",
      image: "/lovable-Uploads/eff163be-1c47-461b-9578-835f61b94be3.png"
    },
    {
      id: 2,
      title: "Secured Party Creditor",
      overlayTitle: "Secured Party Creditor",
      image: "/lovable-Uploads/d121a522-f423-4dda-a495-7db38ce64d3e.png"
    },
    {
      id: 3,
      title: "Conventions",
      overlayTitle: "Conventions",
      image: "/lovable-Uploads/2ed2581f-984b-48fb-9383-20be2b2a403b.png"
    },
    {
      id: 4,
      title: "UCC FINANCING STATEMENT (UCC-1)",
      overlayTitle: "UCC FINANCING STATEMENT",
      image: "/lovable-Uploads/2697a99a-01f5-4d5b-a1d8-711fd6153b61.png"
    },
    {
      id: 5,
      title: "Regional Filing Information",
      overlayTitle: "Regional Filing Information",
      image: "/lovable-Uploads/5647e266-bf77-45f9-a384-de42774e4b47.png"
    },
    {
      id: 6,
      title: "SPC TRUST INSTRUCTIONS",
      overlayTitle: "SPC TRUST INSTRUCTIONS",
      image: "/lovable-Uploads/a03733d8-1674-4333-918e-c6b3383e4f93.png"
    },
    {
      id: 7,
      title: "Abstract of Trust",
      overlayTitle: "Abstract of Trust",
      image: "/lovable-Uploads/e1140c81-8913-43fd-960b-daa381a3a5a3.png"
    }
  ];

  const freshmanLessons = [
    {
      id: 1,
      title: "Intro, Purpose, and Self-ownership",
      overlayTitle: "Intro, Purpose, and Self-ownership",
      image: "/lovable-Uploads/1ce7621d-12a6-48b6-af5e-fd14f0fbed04.png"
    },
    {
      id: 2,
      title: "Consent, Natural order",
      overlayTitle: "Consent, Natural order",
      image: "/lovable-Uploads/f1555623-f82f-42e5-b544-12bfe9b777a6.png"
    },
    {
      id: 3,
      title: "hierarchy of sovereignty",
      overlayTitle: "hierarchy of sovereignty",
      image: "/lovable-Uploads/1af99f10-8975-4bb9-8752-219253e01966.png"
    },
    {
      id: 4,
      title: "Basics of sovereignty",
      overlayTitle: "Basics of sovereignty",
      image: "/lovable-Uploads/01ae94ef-2ea4-47e3-afe7-93c57305261e.png"
    },
    {
      id: 5,
      title: "who can be sovereign?",
      overlayTitle: "who can be sovereign?",
      image: "/lovable-Uploads/0cf40e56-babb-4c2c-a5e7-db13c9fbffd9.png"
    },
    {
      id: 6,
      title: "Equal protection, Disqualification",
      overlayTitle: "Equal protection, Disqualification",
      image: "/lovable-Uploads/11f18cf8-1e83-40d9-9341-09b04083b9db.png"
    },
    {
      id: 7,
      title: "Figuring it all out, protection by god vs governement",
      overlayTitle: "Figuring it all out, protection by god vs governement",
      image: "/lovable-Uploads/f2275b30-537b-490b-b7cd-f8f6246ed17d.png"
    },
    {
      id: 8,
      title: "god's religion vs. government religion",
      overlayTitle: "god's religion vs. government religion",
      image: "/lovable-Uploads/38c33097-d44a-41c6-add8-795807ed87df.png"
    },
    {
      id: 9,
      title: "public vs. private, separation of power",
      overlayTitle: "public vs. private, separation of power",
      image: "/lovable-Uploads/f981be64-74ac-465d-9636-a02293673c33.png"
    },
    {
      id: 10,
      title: "sovereign = foreign, criminal convictions",
      overlayTitle: "sovereign = foreign, criminal convictions",
      image: "/lovable-Uploads/da133528-a9b3-4be3-9ab4-d534ab57ad45.png"
    }
  ];

  const remedyLessons = [
    {
      id: 1,
      title: "What is Credit?",
      overlayTitle: "What is Credit?",
      image: "/lovable-Uploads/d7bcc7e0-e247-4665-9717-d631d3bfc034.png"
    },
    {
      id: 2,
      title: "The Importance of Credit",
      overlayTitle: "The Importance of Credit",
      image: "/lovable-Uploads/a9b171e7-5786-451e-b727-4f83609803ee.png"
    },
    {
      id: 3,
      title: "Credit Reports",
      overlayTitle: "Credit Reports",
      image: "/lovable-Uploads/933b6019-ec10-4de2-8ab4-da1639be8f95.png"
    },
    {
      id: 4,
      title: "Establishing Credit",
      overlayTitle: "Establishing Credit",
      image: "/lovable-Uploads/32010950-1b50-499e-aec2-40d5180e32b4.png"
    },
    {
      id: 5,
      title: "Control Your Credit",
      overlayTitle: "Control Your Credit",
      image: "/lovable-Uploads/23a06db6-550c-43c2-8e1c-d3228ce1e165.png"
    },
    {
      id: 6,
      title: "Improve Your Credit Score",
      overlayTitle: "Improve Your Credit Score",
      image: "/lovable-Uploads/1900c96d-55e4-4e3b-bb0c-b390b4ee1afc.png"
    },
    {
      id: 7,
      title: "Credit Disputes & Legal Remedies",
      overlayTitle: "Credit Disputes & Legal Remedies",
      image: "/lovable-Uploads/8b0c41cf-47b3-42fb-87e3-67aadbb7396e.png"
    },
    {
      id: 8,
      title: "Restoring Your Credit After Identity Theft",
      overlayTitle: "Restoring Your Credit After Identity Theft",
      image: "/lovable-Uploads/da964dd1-b3c4-43cb-b336-4c761ba99b08.png"
    }
  ];

  const juniorLessons = [
    {
      id: 1,
      title: "Understanding 'Doing Business'",
      overlayTitle: "Understanding 'Doing Business'",
      image: "/lovable-Uploads/c9ae2ddf-95ad-49c3-b00a-3ee1e0ea10b9.png"
    },
    {
      id: 2,
      title: "The Nature and Purpose of 'Business Regulation'",
      overlayTitle: "The Nature and Purpose of 'Business Regulation'",
      image: "/lovable-Uploads/e041abfe-7130-4fe9-8537-b5a4d1577c51.png"
    },
    {
      id: 3,
      title: "Statutory Jurisdiction vs. Common Law Jurisdiction",
      overlayTitle: "Statutory Jurisdiction vs. Common Law Jurisdiction",
      image: "/lovable-Uploads/30443c73-8965-422a-928a-0762392ba224.png"
    },
    {
      id: 4,
      title: "Key Legal Definitions: Resident, Domicile, and Citizen",
      overlayTitle: "Key Legal Definitions: Resident, Domicile, and Citizen",
      image: "/lovable-Uploads/8072ede5-2f95-4f88-8b0c-1904729c1c90.png"
    },
    {
      id: 5,
      title: "How the State Defines a 'Business'",
      overlayTitle: "How the State Defines a 'Business'",
      image: "/lovable-Uploads/912b901c-8e84-470c-85fa-973e0090ad34.png"
    }
  ];

  const lmsLessons = [
    {
      id: 1,
      title: "CREDITOR ACADEMY INTERNAL EXAM",
      overlayTitle: "CREDITOR ACADEMY INTERNAL EXAM",
      image: "/lovable-Uploads/db03ede9-2a9a-4f3a-9a57-1d920a108736.png"
    },
    {
      id: 2,
      title: "LMS BASIC TUTORIAL",
      overlayTitle: "LMS BASIC TUTORIAL",
      image: "/lovable-Uploads/028a87d6-ca78-40ca-91bf-9855c84860a9.png"
    }
  ];

  const merchantLessons = [
    {
      id: 1,
      title: "Understanding Credit Card Processing",
      overlayTitle: "Understanding Credit Card Processing",
      image: "/lovable-Uploads/2b662ec3-6bbf-436e-9774-09c256fe6570.png"
    }
  ];

  const seniorLessons = [
    {
      id: 1,
      title: "Why Business Credit?",
      overlayTitle: "Why Business Credit?",
      image: "/lovable-Uploads/a2ede8f2-cd29-4a30-98a8-6b1590bf938d.png"
    }
  ];

  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedFreshmanLesson, setSelectedFreshmanLesson] = useState(null);
  const [selectedRemedyLesson, setSelectedRemedyLesson] = useState(null);
  const [selectedJuniorLesson, setSelectedJuniorLesson] = useState(null);
  const [selectedLmsLesson, setSelectedLmsLesson] = useState(null);
  const [selectedMerchantLesson, setSelectedMerchantLesson] = useState(null);
  const [selectedSeniorLesson, setSelectedSeniorLesson] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGameIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % games.length;
        setSelectedGame(games[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [games]);

  const handleBackToLMS = () => {
    navigate("/");
  };

  const handleGameSelect = (game, index) => {
    setSelectedGame(game);
    setCurrentGameIndex(index);
  };

  const handlePrevGame = () => {
    const prevIndex = currentGameIndex === 0 ? games.length - 1 : currentGameIndex - 1;
    setSelectedGame(games[prevIndex]);
    setCurrentGameIndex(prevIndex);
  };

  const handleNextGame = () => {
    const nextIndex = (currentGameIndex + 1) % games.length;
    setSelectedGame(games[nextIndex]);
    setCurrentGameIndex(nextIndex);
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson.id);
  };

  const handleFreshmanLessonSelect = (lesson) => {
    setSelectedFreshmanLesson(lesson.id);
  };

  const handleRemedyLessonSelect = (lesson) => {
    setSelectedRemedyLesson(lesson.id);
  };

  const handleJuniorLessonSelect = (lesson) => {
    setSelectedJuniorLesson(lesson.id);
  };

  const handleLmsLessonSelect = (lesson) => {
    setSelectedLmsLesson(lesson.id);
  };

  const handleMerchantLessonSelect = (lesson) => {
    setSelectedMerchantLesson(lesson.id);
  };

  const handleSeniorLessonSelect = (lesson) => {
    setSelectedSeniorLesson(lesson.id);
  };

  const handleGameDetailOpen = (game) => {
    setSelectedGameDetail(game);
  };

  const handleLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleFreshmanLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleRemedyLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleJuniorLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleLmsLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleMerchantLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleSeniorLessonDetailOpen = (lesson) => {
    setSelectedGameDetail(lesson);
  };

  const handleGameDetailClose = () => {
    setSelectedGameDetail(null);
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollFreshmanLeft = () => {
    if (freshmanScrollContainerRef.current) {
      freshmanScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollFreshmanRight = () => {
    if (freshmanScrollContainerRef.current) {
      freshmanScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollRemedyLeft = () => {
    if (remedyScrollContainerRef.current) {
      remedyScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRemedyRight = () => {
    if (remedyScrollContainerRef.current) {
      remedyScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollJuniorLeft = () => {
    if (juniorScrollContainerRef.current) {
      juniorScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollJuniorRight = () => {
    if (juniorScrollContainerRef.current) {
      juniorScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLmsLeft = () => {
    if (lmsScrollContainerRef.current) {
      lmsScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollLmsRight = () => {
    if (lmsScrollContainerRef.current) {
      lmsScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollMerchantLeft = () => {
    if (merchantScrollContainerRef.current) {
      merchantScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollMerchantRight = () => {
    if (merchantScrollContainerRef.current) {
      merchantScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollSeniorLeft = () => {
    if (seniorScrollContainerRef.current) {
      seniorScrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollSeniorRight = () => {
    if (seniorScrollContainerRef.current) {
      seniorScrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (selectedGameDetail) {
    return <GameDetailView game={selectedGameDetail} onClose={handleGameDetailClose} />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGame.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${selectedGame.image})`
              }}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-8 left-8 z-10"
        >
          <Button
            onClick={handleBackToLMS}
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to LMS
          </Button>
        </motion.div>

        <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
          <motion.div
            key={selectedGame.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {selectedGame.title}
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {selectedGame.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6"
            >
              <Button 
                onClick={() => scrollToSection(selectedGame.sectionRef)}
                className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white px-8 py-3 text-lg font-bold rounded-lg transition-all duration-500 shadow-2xl hover:shadow-red-500/30 transform hover:scale-105 border-2 border-red-400/30 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View More
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-yellow-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-8 w-[50vw]">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative"
          >
            <button
              onClick={handlePrevGame}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={handleNextGame}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>

            <div className="flex gap-4 overflow-hidden">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  className={`cursor-pointer transition-all duration-300 flex-shrink-0 ${
                    selectedGame.id === game.id 
                      ? "ring-2 ring-blue-500 shadow-2xl scale-105" 
                      : "opacity-70 hover:opacity-100 hover:scale-105 hover:ring-1 hover:ring-white/50"
                  }`}
                  onClick={() => handleGameSelect(game, index)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-24 h-16 rounded-lg bg-cover bg-center bg-no-repeat shadow-lg"
                    style={{
                      backgroundImage: `url(${game.image})`
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div ref={sophomoreRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SOPHOMORE: BECOME PRIVATE
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowScrollButtons(true)}
            onMouseLeave={() => setShowScrollButtons(false)}
          >
            <AnimatePresence>
              {showScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedLesson === lesson.id 
                      ? 'ring-4 ring-blue-500 shadow-2xl shadow-blue-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedLesson === lesson.id ? 'bg-blue-500/20' : ''
                    }`} />
                    {selectedLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedLesson === lesson.id 
                          ? 'from-blue-400 to-purple-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-blue-300 group-hover:to-purple-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={freshmanRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            FRESHMAN: NEW SOV 101
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowFreshmanScrollButtons(true)}
            onMouseLeave={() => setShowFreshmanScrollButtons(false)}
          >
            <AnimatePresence>
              {showFreshmanScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollFreshmanLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollFreshmanRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={freshmanScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {freshmanLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedFreshmanLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleFreshmanLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedFreshmanLesson === lesson.id 
                      ? 'ring-4 ring-green-500 shadow-2xl shadow-green-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedFreshmanLesson === lesson.id ? 'bg-green-500/20' : ''
                    }`} />
                    {selectedFreshmanLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedFreshmanLesson === lesson.id 
                          ? 'from-green-400 to-emerald-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-green-300 group-hover:to-emerald-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={remedyRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            I WANT REMEDY NOW!
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowRemedyScrollButtons(true)}
            onMouseLeave={() => setShowRemedyScrollButtons(false)}
          >
            <AnimatePresence>
              {showRemedyScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollRemedyLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollRemedyRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={remedyScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {remedyLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedRemedyLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleRemedyLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedRemedyLesson === lesson.id 
                      ? 'ring-4 ring-red-500 shadow-2xl shadow-red-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedRemedyLesson === lesson.id ? 'bg-red-500/20' : ''
                    }`} />
                    {selectedRemedyLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedRemedyLesson === lesson.id 
                          ? 'from-red-400 to-orange-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-red-300 group-hover:to-orange-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={juniorRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            JUNIOR: OPERATE PRIVATE
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowJuniorScrollButtons(true)}
            onMouseLeave={() => setShowJuniorScrollButtons(false)}
          >
            <AnimatePresence>
              {showJuniorScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollJuniorLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollJuniorRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={juniorScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {juniorLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedJuniorLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleJuniorLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedJuniorLesson === lesson.id 
                      ? 'ring-4 ring-cyan-500 shadow-2xl shadow-cyan-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedJuniorLesson === lesson.id ? 'bg-cyan-500/20' : ''
                    }`} />
                    {selectedJuniorLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedJuniorLesson === lesson.id 
                          ? 'from-cyan-400 to-blue-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-cyan-300 group-hover:to-blue-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={lmsRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
            LMS NAVIGATION TUTORIALS
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowLmsScrollButtons(true)}
            onMouseLeave={() => setShowLmsScrollButtons(false)}
          >
            <AnimatePresence>
              {showLmsScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollLmsLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollLmsRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={lmsScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {lmsLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedLmsLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleLmsLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedLmsLesson === lesson.id 
                      ? 'ring-4 ring-violet-500 shadow-2xl shadow-violet-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedLmsLesson === lesson.id ? 'bg-violet-500/20' : ''
                    }`} />
                    {selectedLmsLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedLmsLesson === lesson.id 
                          ? 'from-violet-400 to-purple-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-violet-300 group-hover:to-purple-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={merchantRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent">
            PRIVATE MERCHANT PROCESSING COURSE
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowMerchantScrollButtons(true)}
            onMouseLeave={() => setShowMerchantScrollButtons(false)}
          >
            <AnimatePresence>
              {showMerchantScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollMerchantLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollMerchantRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={merchantScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {merchantLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedMerchantLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleMerchantLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedMerchantLesson === lesson.id 
                      ? 'ring-4 ring-pink-500 shadow-2xl shadow-pink-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedMerchantLesson === lesson.id ? 'bg-pink-500/20' : ''
                    }`} />
                    {selectedMerchantLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedMerchantLesson === lesson.id 
                          ? 'from-pink-400 to-rose-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-pink-300 group-hover:to-rose-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={seniorRef} className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-black to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
            SENIOR: BUILD UNLIMITED CREDIT
          </h2>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowSeniorScrollButtons(true)}
            onMouseLeave={() => setShowSeniorScrollButtons(false)}
          >
            <AnimatePresence>
              {showSeniorScrollButtons && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={scrollSeniorLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={scrollSeniorRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            <div 
              ref={seniorScrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {seniorLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 group ${
                    selectedSeniorLesson === lesson.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleSeniorLessonDetailOpen(lesson)}
                >
                  <div className={`relative rounded-xl overflow-hidden shadow-lg ${
                    selectedSeniorLesson === lesson.id 
                      ? 'ring-4 ring-amber-500 shadow-2xl shadow-amber-500/30' 
                      : 'group-hover:ring-2 group-hover:ring-white/50'
                  }`}>
                    <div
                      className="w-64 h-80 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${lesson.image})`
                      }}
                    >
                      <div className="absolute inset-0 flex items-end justify-center p-4">
                        <motion.h3
                          className="text-white font-bold text-lg text-center leading-tight drop-shadow-2xl bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg backdrop-blur-sm border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {lesson.overlayTitle}
                        </motion.h3>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent ${
                      selectedSeniorLesson === lesson.id ? 'bg-amber-500/20' : ''
                    }`} />
                    {selectedSeniorLesson === lesson.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 w-64">
                    <motion.h3 
                      className={`font-extrabold text-sm leading-tight transition-colors duration-300 break-words bg-gradient-to-r ${
                        selectedSeniorLesson === lesson.id 
                          ? 'from-amber-400 to-yellow-400 text-transparent bg-clip-text' 
                          : 'from-white to-gray-300 text-transparent bg-clip-text group-hover:from-amber-300 group-hover:to-yellow-300'
                      } tracking-wide uppercase`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lesson.title}
                    </motion.h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Games;