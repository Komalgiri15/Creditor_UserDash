import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GameDetailView = ({ game, onClose }) => {
  // Horizontal background images for game details
  const horizontalImages = [
    '/lovable-uploads/30443c73-8965-422a-928a-0762392ba224.png',
    '/lovable-uploads/8072ede5-2f95-4f88-8b0c-1904729c1c90.png',
    '/lovable-uploads/912b901c-8e84-470c-85fa-973e0090ad34.png',
    '/lovable-uploads/db03ede9-2a9a-4f3a-9a57-1d920a108736.png',
    '/lovable-uploads/028a87d6-ca78-40ca-91bf-9855c84860a9.png',
    '/lovable-uploads/2b662ec3-6bbf-436e-9774-09c256fe6570.png',
    '/lovable-uploads/a2ede8f2-cd29-4a30-98a8-6b1590bf938d.png',
    '/lovable-uploads/0f16bb53-5025-49b7-af0e-135fe28fe915.png',
    '/lovable-uploads/3a33e58c-4d85-45b5-ab08-700ca5e4292a.png'
  ];

  // Get a shuffled image based on game ID
  const getShuffledImage = (gameId) => {
    const shuffledIndex = (gameId * 7 + 3) % horizontalImages.length;
    return horizontalImages[shuffledIndex];
  };

  const rules = [
    "Complete all assigned modules in sequential order",
    "Maintain 80% attendance in live sessions",
    "Submit assignments within the specified deadline",
    "Participate actively in group discussions",
    "Pass all quizzes with minimum 70% score",
    "Follow academic integrity guidelines",
    "Respect fellow learners and instructors"
  ];

  const pointsSystem = [
    { action: "Complete a lesson", points: 50 },
    { action: "Pass a quiz", points: 100 },
    { action: "Submit assignment on time", points: 150 },
    { action: "Participate in live session", points: 75 },
    { action: "Help a fellow learner", points: 25 },
    { action: "Perfect quiz score (100%)", points: 200 },
    { action: "Complete module", points: 500 }
  ];

  const badges = [
    { name: "Quick Learner", requirement: "Complete 5 lessons in one day", icon: "⚡", color: "bg-yellow-500" },
    { name: "Perfect Score", requirement: "Score 100% on 3 consecutive quizzes", icon: "🎯", color: "bg-green-500" },
    { name: "Helpful Friend", requirement: "Help 10 fellow learners", icon: "🤝", color: "bg-blue-500" },
    { name: "Consistent Player", requirement: "Log in for 7 consecutive days", icon: "📅", color: "bg-purple-500" },
    { name: "Knowledge Seeker", requirement: "Complete all bonus materials", icon: "📚", color: "bg-indigo-500" }
  ];

  const awards = [
    { level: "Bronze", requirement: "Earn 1000 points", description: "Foundation level mastery", icon: Trophy, color: "text-amber-600" },
    { level: "Silver", requirement: "Earn 2500 points + 3 badges", description: "Intermediate proficiency", icon: Medal, color: "text-gray-400" },
    { level: "Gold", requirement: "Earn 5000 points + 5 badges", description: "Advanced expertise", icon: Award, color: "text-yellow-500" },
    { level: "Platinum", requirement: "Earn 10000 points + all badges", description: "Master level achievement", icon: Star, color: "text-purple-500" }
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Hero Section with Horizontal Image */}
      <div className="relative h-96">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getShuffledImage(game.id)})`
          }}
        />
        
        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-8"
        >
          <Button
            onClick={onClose}
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </motion.div>

        {/* Game Title and Description Overlay */}
        <div className="absolute bottom-8 left-8 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {game.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-200 leading-relaxed"
          >
            {game.description} Master advanced concepts through interactive learning experiences, practical exercises, and comprehensive assessments designed to enhance your understanding and practical application of key principles.
          </motion.p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Rules and Regulations */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Rules & Regulations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {rules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <span className="text-red-400 font-bold">{index + 1}.</span>
                  <span className="text-gray-200">{rule}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Points System */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Points System
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pointsSystem.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">{item.action}</span>
                    <Badge className="bg-green-600 text-white">+{item.points}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Badges */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Badges
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {badge.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{badge.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{badge.requirement}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Awards */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Awards & Achievements
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-yellow-900/20 to-red-900/20 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 text-center group"
                >
                  <award.icon className={`w-12 h-12 ${award.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold text-white mb-2">{award.level}</h3>
                  <p className="text-sm text-gray-300 mb-3">{award.requirement}</p>
                  <p className="text-xs text-gray-400">{award.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default GameDetailView;