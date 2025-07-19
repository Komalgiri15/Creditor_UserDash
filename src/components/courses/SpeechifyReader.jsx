import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play,
  Pause,
  Settings,
  Volume2,
  RefreshCcw,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

export function SpeechifyReader({ content, title, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechify, setSpeechify] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [rate, setRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  
  const contentRef = useRef(null);
  const cleanedContent = content.replace(/<\/?[^>]+(>|$)/g, " ").trim();
  
  // Load the Speechify SDK
  useEffect(() => {
    // Check if window.speechify is already available
    if (window.speechify) {
      setSpeechify(window.speechify);
      setIsLoaded(true);
      return;
    }
    
    // Script already exists in document
    const existingScript = document.getElementById('speechify-sdk');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }
    
    // Create and add the script
    const script = document.createElement('script');
    script.src = "https://cdn.speechify.com/speechifysdk.js";
    script.id = 'speechify-sdk';
    script.async = true;
    
    script.onload = () => {
      if (window.speechify) {
        setSpeechify(window.speechify);
        setIsLoaded(true);
        toast.success("Speechify loaded successfully");
      }
    };
    
    script.onerror = () => {
      toast.error("Failed to load Speechify SDK");
    };
    
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      if (window.speechify?.player?.pause) {
        window.speechify.player.pause();
      }
    };
  }, []);
  
  // Initialize Speechify once loaded
  useEffect(() => {
    if (!speechify || !isLoaded) return;
    
    try {
      // Initialize Speechify with the content
      speechify.init({
        text: `${title}. ${cleanedContent}`,
        beforePause: () => setIsPlaying(false),
        beforePlay: () => setIsPlaying(true),
        onTextHighlighted: (info) => {
          const { text, range } = info;
          // Update current position for highlighting
          setCurrentPosition(range.start);
          
          // Auto-scroll to keep the highlighted text in view
          if (contentRef.current) {
            // Create a simple highlighting effect
            const allElements = contentRef.current.querySelectorAll('p, h1, h2, h3, li');
            let currentTextPosition = 0;
            let elementToScroll = null;
            
            // Find the element containing the current position
            for (const element of Array.from(allElements)) {
              const elementText = element.textContent || '';
              if (currentTextPosition + elementText.length > range.start) {
                elementToScroll = element;
                break;
              }
              currentTextPosition += elementText.length;
            }
            
            // Scroll the element into view
            if (elementToScroll) {
              elementToScroll.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }
        }
      });
      
      // Set initial volume and rate
      speechify.player.setVolume(volume);
      speechify.player.setRate(rate);
    } catch (error) {
      console.error("Error initializing Speechify:", error);
      toast.error("Failed to initialize Speechify");
    }
    
  }, [speechify, isLoaded, title, cleanedContent, volume, rate]);
  
  const togglePlayback = () => {
    if (!speechify || !isLoaded) {
      toast.error("Speechify is not loaded yet");
      return;
    }
    
    try {
      if (isPlaying) {
        speechify.player.pause();
        setIsPlaying(false);
      } else {
        speechify.player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      toast.error("Failed to control playback");
    }
  };
  
  const handleRestart = () => {
    if (!speechify || !isLoaded) return;
    
    try {
      speechify.player.pause();
      speechify.player.setPosition(0);
      setCurrentPosition(0);
      setTimeout(() => {
        speechify.player.play();
        setIsPlaying(true);
      }, 300);
    } catch (error) {
      console.error("Error restarting playback:", error);
      toast.error("Failed to restart playback");
    }
  };
  
  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (speechify && isLoaded) {
      try {
        speechify.player.setVolume(newVolume);
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    }
  };
  
  const handleRateChange = (value) => {
    const newRate = value[0];
    setRate(newRate);
    if (speechify && isLoaded) {
      try {
        speechify.player.setRate(newRate);
      } catch (error) {
        console.error("Error setting rate:", error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Back">
            <ArrowLeft size={18} />
          </Button>
          <h2 className="text-lg font-semibold">Speechify Reader</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? "bg-muted" : ""}
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b p-4 bg-muted/30 space-y-4">
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="volume-slider" className="text-sm font-medium">
                Volume
              </label>
              <span className="text-xs text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-muted-foreground" />
              <Slider
                id="volume-slider"
                defaultValue={[volume]}
                value={[volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <Volume2 size={16} />
            </div>
          </div>
          
          {/* Speech Rate Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="rate-slider" className="text-sm font-medium">
                Reading Speed
              </label>
              <span className="text-xs text-muted-foreground">
                {rate.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="rate-slider"
              defaultValue={[rate]}
              value={[rate]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={handleRateChange}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-muted/30">
        <div 
          className="max-w-2xl mx-auto space-y-8"
          ref={contentRef}
        >
          <h1 className="text-3xl font-bold">{title}</h1>
          <div 
            className="prose max-w-none text-2xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-center p-4 border-t">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRestart}
            aria-label="Restart Reading"
            className="rounded-full w-10 h-10"
            disabled={!isLoaded}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 flex items-center justify-center"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause Reading" : "Start Reading"}
            disabled={!isLoaded}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* SDK Loading indicator */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading Speechify...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeechifyReader;