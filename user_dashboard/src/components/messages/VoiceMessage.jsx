import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export function VoiceMessage({ audioBlob, duration, isUser }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const audioUrl = useRef(null);

  useEffect(() => {
    // Create object URL for the audio blob
    audioUrl.current = URL.createObjectURL(audioBlob);
    
    return () => {
      // Clean up object URL
      if (audioUrl.current) {
        URL.revokeObjectURL(audioUrl.current);
      }
    };
  }, [audioBlob]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current && audioUrl.current) {
      const audio = new Audio(audioUrl.current);
      audioRef.current = audio;
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl min-w-[250px] max-w-[320px] shadow-md transition-all duration-200 hover:shadow-lg ${
      isUser 
        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
        : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
    }`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handlePlayPause}
        className={`h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 ${
          isUser 
            ? 'hover:bg-primary-foreground/20 text-primary-foreground shadow-lg' 
            : 'hover:bg-primary/10 text-primary bg-white shadow-md'
        }`}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </Button>
      
      <div className="flex-1 space-y-2">
        <div className={`h-2 rounded-full relative overflow-hidden ${
          isUser ? 'bg-primary-foreground/30' : 'bg-gray-300'
        }`}>
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isUser ? 'bg-primary-foreground shadow-sm' : 'bg-primary shadow-sm'
            }`}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${
            isUser ? 'text-primary-foreground/80' : 'text-gray-600'
          }`}>
            {formatTime(currentTime)}
          </span>
          <span className={`text-xs ${
            isUser ? 'text-primary-foreground/60' : 'text-gray-500'
          }`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;