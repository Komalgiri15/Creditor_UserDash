import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

export function VoiceRecorder({ onSendVoiceMessage, onCancel }) {
  const { 
    isRecording, 
    audioBlob, 
    recordingTime, 
    startRecording, 
    stopRecording, 
    clearRecording 
  } = useVoiceRecording();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSendVoice = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob, recordingTime);
      clearRecording();
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    clearRecording();
    onCancel?.();
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg animate-pulse-subtle">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-red-700">Recording Audio</span>
            <span className="text-xs text-red-600 font-mono">{formatTime(recordingTime)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleStopRecording}
            className="h-10 w-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-200"
          >
            <MicOff className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (audioBlob) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-full">
            <Mic className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-700">Voice Message Ready</span>
            <span className="text-xs text-blue-600 font-mono">Duration: {formatTime(recordingTime)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSendVoice}
            className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-105"
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full h-12 w-12 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 hover:scale-105"
      onClick={handleStartRecording}
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
}

export default VoiceRecorder;