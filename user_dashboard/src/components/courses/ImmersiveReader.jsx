import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Pause,
  Play,
  Settings,
  LayoutGrid,
  Volume2,
  VolumeX,
  RefreshCcw
} from "lucide-react";
import { cn, normalizeWord, debounce } from "@/lib/utils";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import DOMPurify from "dompurify";
import { toast } from "sonner";

function ImmersiveReader({
  title,
  content,
  isOpen,
  onClose,
}) {
  const [fontSize, setFontSize] = useState("text-xl");
  const [lineHeight, setLineHeight] = useState("leading-relaxed");
  const [plainText, setPlainText] = useState("");
  const [processedContent, setProcessedContent] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [rate, setRate] = useState(1.0);
  
  // Track all word elements and their positions
  const [wordElements, setWordElements] = useState([]);
  const [allWordIndexes, setAllWordIndexes] = useState([]);
  
  const contentRef = useRef(null);
  const fullTextRef = useRef("");
  const lastHighlightedIndexRef = useRef(-1);
  const scrollTimeoutRef = useRef(null);
  const textVersionRef = useRef(0); // Track text version to prevent stale references

  const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
  const lineHeights = ["leading-normal", "leading-relaxed", "leading-loose"];

  // Get available voices for speech synthesis
  useEffect(() => {
    const getVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          // Set default voice (prefer English)
          const defaultVoice = voices.find(voice => 
            voice.lang.startsWith('en-')
          ) || voices[0];
          
          if (defaultVoice && !selectedVoiceURI) {
            setSelectedVoiceURI(defaultVoice.voiceURI);
          }
        }
      } catch (error) {
        console.error("Error getting voices:", error);
      }
    };

    // Get voices immediately in case they're already loaded
    getVoices();
    
    // Add event listener for when voices change
    window.speechSynthesis.onvoiceschanged = getVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoiceURI]);

  // Extract plain text and prepare for TTS - IMPROVED
  useEffect(() => {
    if (isOpen && content) {
      try {
        // Increment text version to avoid stale references
        textVersionRef.current++;
        const currentVersion = textVersionRef.current;
        
        // Create a temporary element to parse the HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = DOMPurify.sanitize(content);
        
        // Extract text content
        const extractedText = tempDiv.textContent || tempDiv.innerText || "";
        
        // Clean the text for better TTS processing
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .replace(/[\n\r\t\f\v]+/g, ' ')
          .trim();
        
        // Combine title and content with proper spacing
        const fullText = `${title}. ${cleanedText}`;
        setPlainText(fullText);
        fullTextRef.current = fullText;
        setTextContent(fullText);
        
        console.log("Text prepared for speech, length:", fullText.length);
        
        // Process content for highlighting with improved word mapping
        processContentForHighlighting(content, currentVersion);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error("Error processing text content");
      }
    }
  }, [isOpen, content, title]);

  // Improved content processing for more reliable highlighting
  const processContentForHighlighting = (htmlContent, version) => {
    try {
      // Create a document from the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(DOMPurify.sanitize(htmlContent), 'text/html');
      
      // Word index counter for data-index attributes
      let wordIndex = 0;
      let globalCharIndex = 0;
      const allWords = [];
      
      // Recursive function to process all text nodes with accurate character position tracking
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
          const fragment = document.createDocumentFragment();
          const text = node.textContent;
          
          // Split text into words and spaces, preserving punctuation
          const tokenRegex = /(\S+|\s+)/g;
          let match;
          let lastIndex = 0;
          
          while ((match = tokenRegex.exec(text)) !== null) {
            const token = match[0];
            const startIndex = match.index;
            
            // If token is not just whitespace, create a word span
            if (token.trim()) {
              const span = document.createElement('span');
              span.className = 'reader-word';
              span.dataset.index = wordIndex.toString();
              
              const originalWord = token;
              const normalized = normalizeWord(token);
              
              span.dataset.word = originalWord;
              span.dataset.normalizedWord = normalized;
              span.dataset.charIndex = (globalCharIndex + startIndex).toString();
              span.textContent = token;
              fragment.appendChild(span);
              
              // Track this word with character position
              allWords.push({ 
                word: originalWord, 
                normalizedWord: normalized,
                index: wordIndex,
                charIndex: globalCharIndex + startIndex,
                element: null
              });
              
              wordIndex++;
            } else {
              // It's whitespace - keep as is
              fragment.appendChild(document.createTextNode(token));
            }
            
            lastIndex = match.index + token.length;
          }
          
          // Update global character index
          globalCharIndex += text.length;
          
          // Replace the original text node with our fragment
          if (node.parentNode) {
            node.parentNode.replaceChild(fragment, node);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && 
                  !['SCRIPT', 'STYLE', 'PRE', 'CODE'].includes(node.tagName)) {
          // Process all child nodes recursively
          Array.from(node.childNodes).forEach(processNode);
        }
      };
      
      // Process all nodes in the body
      Array.from(doc.body.childNodes).forEach(processNode);
      
      // Store the word index mapping
      if (version === textVersionRef.current) { // Prevent stale updates
        setAllWordIndexes(allWords);
      }
      
      // Set the processed HTML content
      setProcessedContent(doc.body.innerHTML);
      console.log(`Processed content for highlighting with ${wordIndex} indexed words`);
    } catch (error) {
      console.error("Error processing content for highlighting:", error);
      setProcessedContent(htmlContent); // Fallback to original content
    }
  };

  // Configure speech synthesis with selected voice
  const selectedVoice = availableVoices.find(voice => voice.voiceURI === selectedVoiceURI);
  
  const {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    supported,
    currentWordPosition
  } = useSpeechSynthesis({
    text: textContent,
    rate,
    pitch: 1,
    volume,
    voice: selectedVoice,
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [stop]);

  // Stop speech when dialog closes
  useEffect(() => {
    if (!isOpen) {
      stop();
      
      // Clear all highlights when dialog closes
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }
  }, [isOpen, stop]);

  // Create a smooth scroll function with increased delay
  const smoothScrollToElement = useCallback(
    debounce((element) => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, 300),
    []
  );

  // Index all word elements after the content is rendered
  useEffect(() => {
    if (contentRef.current && processedContent) {
      // Wait for DOM to update
      setTimeout(() => {
        if (contentRef.current) {
          const spans = Array.from(
            contentRef.current.querySelectorAll('.reader-word')
          );
          
          // Store word elements and update indexes with DOM references
          setWordElements(spans);
          
          const updatedIndexes = [...allWordIndexes];
          spans.forEach((span) => {
            const index = parseInt(span.dataset.index || "-1", 10);
            const charIndex = parseInt(span.dataset.charIndex || "-1", 10);
            
            if (index >= 0 && index < updatedIndexes.length) {
              updatedIndexes[index].element = span;
              
              if (charIndex >= 0) {
                updatedIndexes[index].charIndex = charIndex;
              }
            }
          });
          
          setAllWordIndexes(updatedIndexes);
        }
      }, 150);
    }
  }, [processedContent, allWordIndexes]);

  // Improved highlighting algorithm with multiple matching strategies
  useEffect(() => {
    if (!speaking || !currentWordPosition || !contentRef.current) {
      // Clear highlights when not speaking
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
        lastHighlightedIndexRef.current = -1;
      }
      return;
    }
    
    try {
      // Clear previous highlights
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.highlight-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      // Get the spoken word and its character position
      const { word: spokenWord, charIndex: spokenCharIndex } = currentWordPosition;
      const normalizedSpokenWord = normalizeWord(spokenWord);
      
      if (!normalizedSpokenWord) {
        return;
      }
      
      // Three-stage matching strategy
      // 1. Try character index proximity first (most accurate)
      // 2. Then try exact word match after last highlighted position
      // 3. Finally fall back to any match of the word
      
      const CHAR_INDEX_TOLERANCE = 30; // Increased tolerance for better matching
      
      // Stage 1: Find by character index proximity
      let matchingWords = allWordIndexes.filter(item => 
        Math.abs(item.charIndex - spokenCharIndex) < CHAR_INDEX_TOLERANCE && 
        item.element
      );
      
      // If multiple matches by char index, prefer word content match
      if (matchingWords.length > 1) {
        const exactMatches = matchingWords.filter(item => 
          item.normalizedWord === normalizedSpokenWord ||
          item.normalizedWord.includes(normalizedSpokenWord) ||
          normalizedSpokenWord.includes(item.normalizedWord)
        );
        
        if (exactMatches.length > 0) {
          matchingWords = exactMatches;
        }
        
        // Sort by character index proximity
        matchingWords.sort((a, b) => 
          Math.abs(a.charIndex - spokenCharIndex) - Math.abs(b.charIndex - spokenCharIndex)
        );
      }
      
      // Stage 2: If no character match, find by word after last position
      if (matchingWords.length === 0) {
        const wordMatches = allWordIndexes.filter(item => 
          (item.normalizedWord === normalizedSpokenWord ||
           item.normalizedWord.includes(normalizedSpokenWord) ||
           normalizedSpokenWord.includes(item.normalizedWord)) && 
          item.element && 
          item.index > lastHighlightedIndexRef.current
        );
        
        if (wordMatches.length > 0) {
          matchingWords = [wordMatches[0]]; // Take the first match after last position
        }
      }
      
      // Stage 3: Fall back to any matching word if still no match
      if (matchingWords.length === 0) {
        const anyWordMatches = allWordIndexes.filter(item => 
          (item.normalizedWord === normalizedSpokenWord ||
           item.normalizedWord.includes(normalizedSpokenWord) ||
           normalizedSpokenWord.includes(item.normalizedWord)) && 
          item.element
        );
        
        if (anyWordMatches.length > 0) {
          matchingWords = [anyWordMatches[0]];
        }
      }
      
      // Apply highlight to the best match
      if (matchingWords.length > 0 && matchingWords[0].element) {
        const bestMatch = matchingWords[0];
        const elementToHighlight = bestMatch.element;
        
        // Apply highlight class
        elementToHighlight.classList.add('highlight-word');
        lastHighlightedIndexRef.current = bestMatch.index;
        
        // Scroll to the highlighted element
        smoothScrollToElement(elementToHighlight);
      }
    } catch (error) {
      console.error("Error highlighting word:", error);
    }
  }, [currentWordPosition, speaking, allWordIndexes, smoothScrollToElement]);

  const togglePlayback = () => {
    try {
      if (speaking) {
        paused ? resume() : pause();
      } else {
        // Reset highlight tracking when starting new reading
        lastHighlightedIndexRef.current = -1;
        speak(textContent);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      toast.error("Error controlling playback. Please try again.");
    }
  };
  
  // Restart function for error recovery
  const handleRestart = () => {
    try {
      // Stop any ongoing speech
      stop();
      
      // Reset position and highlighting
      lastHighlightedIndexRef.current = -1;
      
      if (contentRef.current) {
        const allWords = contentRef.current.querySelectorAll('.reader-word');
        allWords.forEach(word => {
          word.classList.remove('highlight-word');
        });
      }
      
      // Delay before restarting
      setTimeout(() => {
        speak(textContent);
      }, 300);
    } catch (error) {
      console.error("Error restarting playback:", error);
      toast.error("Could not restart reading. Please try again.");
    }
  };

  const increaseFontSize = () => {
    const index = sizes.indexOf(fontSize);
    if (index < sizes.length - 1) {
      setFontSize(sizes[index + 1]);
    }
  };

  const decreaseFontSize = () => {
    const index = sizes.indexOf(fontSize);
    if (index > 0) {
      setFontSize(sizes[index - 1]);
    }
  };

  const toggleLineHeight = () => {
    const index = lineHeights.indexOf(lineHeight);
    const nextIndex = (index + 1) % lineHeights.length;
    setLineHeight(lineHeights[nextIndex]);
  };

  const handleVolumeChange = (value) => {
    try {
      const newVolume = value[0];
      setVolume(newVolume);
      if (speaking) {
        // Update volume on the fly
        stop();
        setTimeout(() => speak(textContent), 100);
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  const handleVoiceChange = (voiceURI) => {
    try {
      setSelectedVoiceURI(voiceURI);
      if (speaking) {
        // Update voice on the fly
        stop();
        setTimeout(() => speak(textContent), 100);
      }
    } catch (error) {
      console.error("Error changing voice:", error);
    }
  };
  
  const handleRateChange = (value) => {
    try {
      const newRate = value[0];
      setRate(newRate);
      if (speaking) {
        // Update rate on the fly
        stop();
        setTimeout(() => speak(textContent), 100);
      }
    } catch (error) {
      console.error("Error changing rate:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 bg-background">
        {/* Add DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Immersive Reader</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close Reader">
              <ArrowLeft size={18} />
            </Button>
            <h2 className="text-lg font-semibold">Immersive Reader</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={decreaseFontSize} aria-label="Decrease font size">
              <span className="text-sm">A-</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={increaseFontSize} aria-label="Increase font size">
              <span className="text-base font-bold">A+</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLineHeight} aria-label="Toggle line spacing">
              <span className="text-sm">↕</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
              className={cn(showSettings && "bg-muted")}
            >
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Exit Reader">
              <LayoutGrid size={18} />
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
                <VolumeX size={16} className="text-muted-foreground" />
                <Slider
                  id="volume-slider"
                  defaultValue={[volume]}
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
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={handleRateChange}
                className="flex-1"
              />
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <label htmlFor="voice-select" className="text-sm font-medium">
                Voice
              </label>
              <Select 
                value={selectedVoiceURI}
                onValueChange={handleVoiceChange}
              >
                <SelectTrigger id="voice-select" className="w-full">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Content - with custom styling for word highlighting */}
        <style>
          {`
          .highlight-word {
            background-color: rgba(var(--primary) / 0.3);
            color: hsl(var(--primary));
            font-weight: bold;
            border-radius: 0.25rem;
            padding: 0 0.25rem;
            transition: all 0.15s ease-out;
            font-size: 1.05em;
          }
          
          .reader-word {
            transition: all 0.15s ease-out;
            display: inline-block;
            margin: 0 1px;
            padding: 0 1px;
            border-radius: 0.25rem;
          }
          `}
        </style>

        <ScrollArea className="flex-1 p-8 md:p-16 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div 
              className={cn("prose max-w-none", fontSize, lineHeight)}
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        </ScrollArea>

        {/* Audio Controls */}
        <div className="flex items-center justify-center p-4 border-t">
          {supported ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRestart}
                aria-label="Restart Reading"
                className="rounded-full w-10 h-10"
                title="Restart reading from the beginning"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 flex items-center justify-center"
                onClick={togglePlayback}
                aria-label={speaking && !paused ? "Pause Reading" : "Start Reading"}
              >
                {speaking && !paused ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Text-to-speech not supported in this browser
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImmersiveReader;