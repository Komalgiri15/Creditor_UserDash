import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Clock,
  Bookmark,
  BookmarkPlus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import  ImmersiveReader  from "@/components/courses/ImmersiveReader";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

// Sample lesson data by module and lesson ID
const lessonsDatabase = {
  "1": {
    "1": {
      id: "1",
      moduleId: "1",
      title: "What is Business Trust?",
      description: "Learn the basic definition and key concepts of business trust structures.",
      type: "video",
      duration: "15:30",
      completed: true,
      locked: false,
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      content: `
        <h2>Understanding Business Trust</h2>
        <p>A business trust is a legal entity created to hold and manage business assets. Unlike corporations or partnerships, business trusts offer unique advantages in terms of flexibility and tax treatment.</p>
        
        <h3>Key Characteristics</h3>
        <ul>
          <li>Separation of ownership and management</li>
          <li>Flexible governance structure</li>
          <li>Pass-through taxation benefits</li>
          <li>Limited liability protection</li>
        </ul>
        
        <h3>Common Use Cases</h3>
        <p>Business trusts are commonly used in real estate investment, asset management, and succession planning. They provide a robust framework for managing complex business relationships while maintaining operational flexibility.</p>
      `
    },
    "2": {
      id: "2",
      moduleId: "1", 
      title: "Types of Business Trusts",
      description: "Explore different types of business trusts and their specific use cases.",
      type: "text",
      duration: "8 min read",
      completed: false,
      locked: false,
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000",
      videoUrl: "",
      content: `
        <h2>Types of Business Trusts</h2>
        <p>There are several types of business trusts, each designed for specific purposes and circumstances. Understanding these variations is crucial for selecting the right structure for your business needs.</p>
        
        <h3>1. Statutory Business Trusts</h3>
        <p>These are trusts created under specific state statutes that govern their formation and operation. They offer standardized structures with well-defined legal frameworks.</p>
        
        <h3>2. Common Law Business Trusts</h3>
        <p>Also known as Massachusetts Trusts, these are created under common law principles without specific statutory authorization. They offer greater flexibility but may face more legal uncertainty.</p>
        
        <h3>3. Real Estate Investment Trusts (REITs)</h3>
        <p>Specialized business trusts that focus on real estate investments. REITs must meet specific requirements to qualify for favorable tax treatment.</p>
        
        <h3>4. Asset Protection Trusts</h3>
        <p>Designed primarily to protect assets from creditors while maintaining some level of beneficial interest for the settlor.</p>
        
        <h3>Choosing the Right Type</h3>
        <p>The choice of business trust type depends on factors such as the nature of assets, tax objectives, liability concerns, and regulatory requirements in your jurisdiction.</p>
      `
    }
  },
  "2": {
    "1": {
      id: "1",
      moduleId: "2",
      title: "Introduction to Context API",
      description: "Learn about the React Context API and its use cases",
      type: "text",
      duration: "8 min read",
      completed: true,
      locked: false,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
      videoUrl: "",
      content: `
        <h2>Introduction to React Context API</h2>
        <p>The React Context API provides a way to pass data through the component tree without having to pass props down manually at every level. This is particularly useful for data that can be considered "global" for a tree of React components.</p>
        
        <h3>When to Use Context</h3>
        <ul>
          <li>Theme data (dark mode, light mode)</li>
          <li>User authentication state</li>
          <li>Language/locale settings</li>
          <li>Application-wide settings</li>
        </ul>
        
        <h3>Benefits of Context API</h3>
        <p>Context helps avoid prop drilling - the process of passing data through many components that don't actually need the data themselves. It creates a more maintainable and cleaner component structure.</p>
        
        <h3>When NOT to Use Context</h3>
        <p>Context is not a replacement for all prop passing. It should be used sparingly because it makes components less reusable. If you only want to avoid passing some props through many levels, component composition is often a simpler solution than context.</p>
      `
    },
    "2": {
      id: "2",
      moduleId: "2",
      title: "Creating a Context",
      description: "Learn how to create a context and provide it to your component tree.",
      type: "video",
      duration: "18:45",
      completed: true,
      locked: false,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      content: `
        <h2>Creating a Context in React</h2>
        <p>React's Context API provides a way to share values like themes, user data, or any other application state between components without having to explicitly pass props through every level of the component tree.</p>
        
        <h3>Step 1: Create a Context</h3>
        <p>The first step is to create a context using the <code>createContext</code> function.</p>
        
        <pre><code>
import React, { createContext } from 'react';

const ThemeContext = createContext('light');
export default ThemeContext;
        </code></pre>
        
        <h3>Step 2: Create a Provider Component</h3>
        <p>Next, create a provider component that uses the Context.Provider to pass the value down the component tree.</p>
        
        <pre><code>
import React, { useState } from 'react';
import ThemeContext from './ThemeContext';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
        </code></pre>
      `
    }
  }
};

function LessonView() {
  const { moduleId, lessonId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isImmersiveReaderOpen, setIsImmersiveReaderOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const navigate = useNavigate();
  
  const lessonData = lessonsDatabase[moduleId]?.[lessonId] || lessonsDatabase["2"]["2"];
  
  // Animation effect when component mounts
  useEffect(() => {
    const lessonContent = document.querySelector(".lesson-content");
    setTimeout(() => {
      lessonContent?.classList.add("animate-fade-in");
      lessonContent?.classList.remove("opacity-0");
    }, 100);
  }, []);

  const handleOpenImmersiveReader = () => {
    setIsImmersiveReaderOpen(true);
    toast.success("Immersive Reader activated", {
      duration: 3000
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual video playback
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/courses/module/${moduleId}/lessons`}>
              <ChevronLeft size={16} />
              Back to lessons
            </Link>
          </Button>
          <Badge>Context API</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? (
              <>
                <Bookmark size={16} className="mr-2" />
                Bookmarked
              </>
            ) : (
              <>
                <BookmarkPlus size={16} className="mr-2" />
                Bookmark
              </>
            )}
          </Button>
          
        </div>
      </div>
      
      <div className="lesson-content opacity-0 transition-all duration-500 ease-in-out">
        {/* Video content */}
        {lessonData.type === "video" && lessonData.videoUrl && (
          <Card className="mb-6 overflow-hidden">
            <div className="aspect-video bg-black relative">
              <video 
                className="w-full h-full"
                poster={lessonData.thumbnail}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              >
                <source src={lessonData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3 text-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMuteToggle}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => setCurrentTime(value[0])}
                    />
                    <span className="text-xs">{formatTime(duration)}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Lesson metadata */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
          <p className="text-muted-foreground mb-3">{lessonData.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{lessonData.duration}</span>
            </div>
          </div>
        </div>
        
        {/* Video/Audio Description */}
        {lessonData.type === "video" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">About this video</h3>
              <p className="text-sm text-muted-foreground">
                This comprehensive video tutorial walks you through the process of creating a React Context step by step. 
                You'll learn the fundamental concepts, see practical examples, and understand best practices for 
                implementing Context in your React applications.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Accessibility button moved just above the lesson content */}
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenImmersiveReader}
            className="flex items-center gap-1"
          >
            <BookOpen size={16} className="mr-1" />
            Immersive Reader
          </Button>
        </div>
        
        {/* Lesson content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lessonData.content }} />
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" size="lg" asChild>
            <Link to="#prev-lesson">
              <ChevronLeft size={16} className="mr-2" />
              Previous Lesson
            </Link>
          </Button>
          
          <Button size="lg" asChild>
            <Link to="#next-lesson">
              Next Lesson
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Immersive Reader Component */}
      <ImmersiveReader
        title={lessonData.title}
        content={lessonData.content}
        isOpen={isImmersiveReaderOpen}
        onClose={() => setIsImmersiveReaderOpen(false)}
      />
    </div>
  );
}

export default LessonView;