import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { cleanTextForSpeech, normalizeWord } from "@/lib/utils";

function useSpeechSynthesis({
  text,
  rate = 1,
  pitch = 1,
  volume = 1,
  voice = null,
}) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [currentWordPosition, setCurrentWordPosition] = useState(null);
  
  const utteranceRef = useRef(null);
  const textContentRef = useRef("");
  const chunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const wordBoundariesRef = useRef({text: "", boundaries: []});
  
  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);
  
  // Store text in ref when it changes
  useEffect(() => {
    if (text) {
      textContentRef.current = text;
    }
  }, [text]);
  
  // Handle speech errors gracefully
  const handleSpeechError = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setCurrentWordPosition(null);
      
      toast.error(
        "There was a problem with the text-to-speech. Try a different voice or browser.",
        { duration: 4000 }
      );
    } catch (e) {
      console.error("Error handling speech error:", e);
    }
  }, []);
  
  // Prepare text and analyze word boundaries before speech
  const prepareTextAndBoundaries = useCallback((text) => {
    try {
      const cleanedText = cleanTextForSpeech(text);
      
      // More precise regex to identify words including punctuation
      const wordRegex = /(\S+|\s+)/g;
      let match;
      const boundaries = [];
      
      // Create accurate mapping of character indices to words
      while ((match = wordRegex.exec(cleanedText)) !== null) {
        const word = match[0];
        const start = match.index;
        const end = start + word.length;
        
        // Only add non-whitespace segments as actual words
        if (word.trim()) {
          boundaries.push({
            word: word,
            normalizedWord: normalizeWord(word),
            start,
            end,
            charIndex: start
          });
        }
      }
      
      // Store analyzed text and boundaries
      wordBoundariesRef.current = {
        text: cleanedText,
        boundaries
      };
      
      return cleanedText;
    } catch (error) {
      console.error("Error preparing text:", error);
      return text;
    }
  }, []);
  
  // Prepare utterance with boundary detection
  const prepareUtterance = useCallback((textToSpeak, chunkIndex) => {
    if (!supported) return null;
    
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      
      utterance.onend = () => {
        try {
          // If there are more chunks to speak
          if (currentChunkIndexRef.current < chunksRef.current.length - 1) {
            currentChunkIndexRef.current++;
            
            const nextUtterance = prepareUtterance(
              chunksRef.current[currentChunkIndexRef.current],
              currentChunkIndexRef.current
            );
            
            if (nextUtterance) {
              window.speechSynthesis.speak(nextUtterance);
              utteranceRef.current = nextUtterance;
            }
          } else {
            // All chunks have been spoken
            setSpeaking(false);
            setPaused(false);
            setCurrentWordPosition(null);
          }
        } catch (error) {
          console.error("Error in onend handler:", error);
          handleSpeechError();
        }
      };
      
      utterance.onpause = () => {
        setPaused(true);
      };
      
      utterance.onresume = () => {
        setPaused(false);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        handleSpeechError();
      };
      
      // Improved word boundary handling
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          try {
            // Get character index from the event
            const charIndex = event.charIndex;
            
            // Get chunk offset for accurate position tracking
            const chunkOffset = getChunkCharOffset(chunkIndex);
            
            // Adjust for current chunk
            const adjustedCharIndex = charIndex + chunkOffset;
            
            // Find word boundaries that contain this character index
            const boundaries = wordBoundariesRef.current.boundaries;
            
            // Find closest matching word
            let bestMatch = null;
            let minDistance = Number.MAX_VALUE;
            
            for (const boundary of boundaries) {
              const distance = Math.min(
                Math.abs(adjustedCharIndex - boundary.start),
                Math.abs(adjustedCharIndex - boundary.end)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                bestMatch = boundary;
              }
            }
            
            if (bestMatch && minDistance < 50) { // Use tolerance to avoid false matches
              setCurrentWordPosition({
                start: bestMatch.start,
                end: bestMatch.end,
                word: bestMatch.word,
                charIndex: adjustedCharIndex
              });
            }
          } catch (error) {
            console.error("Error in boundary handler:", error);
          }
        }
      };
      
      return utterance;
    } catch (error) {
      console.error("Error preparing utterance:", error);
      handleSpeechError();
      return null;
    }
  }, [rate, pitch, volume, voice, supported, handleSpeechError]);
  
  // Calculate character offset for multi-chunk text
  const getChunkCharOffset = useCallback((chunkIndex) => {
    let offset = 0;
    for (let i = 0; i < chunkIndex; i++) {
      offset += chunksRef.current[i].length;
    }
    return offset;
  }, []);
  
  // Split text into chunks at natural sentence boundaries
  const splitTextIntoChunks = useCallback((text) => {
    try {
      // Smaller chunk size for better reliability
      const MAX_CHUNK_LENGTH = 150;
      const cleanedText = cleanTextForSpeech(text);
      
      // Split by sentence boundaries
      const sentenceSplitRegex = /([.!?])\s+/g;
      let sentences = [];
      let lastIndex = 0;
      let match;
      
      while ((match = sentenceSplitRegex.exec(cleanedText)) !== null) {
        sentences.push(cleanedText.substring(lastIndex, match.index + 1));
        lastIndex = match.index + match[0].length;
      }
      
      // Add final sentence
      if (lastIndex < cleanedText.length) {
        sentences.push(cleanedText.substring(lastIndex));
      }
      
      // Group into manageable chunks
      const chunks = [];
      let currentChunk = "";
      
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      
      // Add final chunk
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      
      return chunks;
    } catch (error) {
      console.error("Error splitting text:", error);
      return [text]; // Fallback to single chunk
    }
  }, []);
  
  // Main speak function
  const speak = useCallback((customText) => {
    if (!supported) return;
    
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const textToSpeak = customText || textContentRef.current;
      if (!textToSpeak) {
        return;
      }
      
      // Prepare text and analyze word boundaries
      const processedText = prepareTextAndBoundaries(textToSpeak);
      
      // Split into chunks
      chunksRef.current = splitTextIntoChunks(processedText);
      currentChunkIndexRef.current = 0;
      
      // Start speaking first chunk
      if (chunksRef.current.length > 0) {
        const utterance = prepareUtterance(chunksRef.current[0], 0);
        if (!utterance) {
          handleSpeechError();
          return;
        }
        
        utteranceRef.current = utterance;
        
        // Short delay for better browser compatibility
        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch (error) {
            console.error("Error starting speech:", error);
            handleSpeechError();
          }
        }, 150);
      }
      
      // Chrome bug workaround: prevent speech from stopping after ~15 seconds
      const keepAliveInterval = setInterval(() => {
        if (!speaking || paused) {
          clearInterval(keepAliveInterval);
          return;
        }
        
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch (e) {
          console.error("Error in speech keepalive:", e);
        }
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(keepAliveInterval);
    } catch (error) {
      console.error("Error starting speech:", error);
      handleSpeechError();
    }
  }, [supported, prepareUtterance, splitTextIntoChunks, speaking, paused, handleSpeechError, prepareTextAndBoundaries]);
  
  // Stop speech
  const stop = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      setCurrentWordPosition(null);
      currentChunkIndexRef.current = 0;
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }, [supported]);
  
  // Pause speech
  const pause = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.pause();
    } catch (error) {
      console.error("Error pausing speech:", error);
    }
  }, [supported]);
  
  // Resume speech
  const resume = useCallback(() => {
    if (!supported) return;
    
    try {
      window.speechSynthesis.resume();
    } catch (error) {
      console.error("Error resuming speech:", error);
    }
  }, [supported]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, [supported]);
  
  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
    currentWordPosition
  };
}

export default useSpeechSynthesis;