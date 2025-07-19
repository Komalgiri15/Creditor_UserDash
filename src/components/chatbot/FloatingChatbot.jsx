import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Send, 
  Minimize2,
  X,
  Bot,
  ChevronRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// FAQ data organized by categories (same as in ChatbotWidget)
const faqCategories = [
  {
    id: "membership",
    name: "Membership-related",
    questions: [
      {
        question: "What are the different membership plans available?",
        answer: "We offer three membership plans: Basic (free access to limited courses), Pro ($29/month with full course library access), and Enterprise (custom pricing for teams with advanced features and dedicated support)."
      },
      {
        question: "What's included in the Basic membership?",
        answer: "The Basic membership includes access to selected free courses, limited progress tracking, and participation in the community forum. Advanced features and premium courses require a Pro or Enterprise subscription."
      },
      {
        question: "How do I upgrade from Basic to Pro or Enterprise?",
        answer: "To upgrade your membership, navigate to your account settings and select 'Membership Plans'. From there, you can choose your preferred plan and complete the payment process to activate your upgraded membership immediately."
      },
      {
        question: "Is there a free trial available before subscribing?",
        answer: "Yes, we offer a 7-day free trial of our Pro membership. You can access all Pro features during this period, and you won't be charged if you cancel before the trial period ends."
      },
      {
        question: "Can I cancel my membership anytime?",
        answer: "Yes, you can cancel your membership at any time through your account settings. Your access will continue until the end of your current billing period, with no additional charges afterward."
      }
    ]
  },
  {
    id: "navigation",
    name: "Navigation & LMS Usage",
    questions: [
      {
        question: "How do I access my enrolled courses?",
        answer: "Your enrolled courses can be accessed from the 'My Courses' section in the main dashboard. Click on any course tile to start or continue your learning journey."
      },
      {
        question: "Where can I view my progress or course completion status?",
        answer: "Your progress is available in two places: on the dashboard overview and in the detailed 'Progress' tab. You'll see completion percentages, recently accessed content, and achievements."
      },
      {
        question: "How do I join live sessions or webinars?",
        answer: "Live sessions appear in your dashboard calendar. Click on the session 15 minutes before start time to enter the waiting room. You'll receive email reminders with direct links 24 hours and 1 hour before the session."
      },
      {
        question: "Where do I find my certificates after course completion?",
        answer: "Certificates are automatically generated when you complete all required course components. Access them in your 'Profile' section under the 'Certificates & Achievements' tab."
      },
      {
        question: "How can I reset my LMS password or update my profile?",
        answer: "To reset your password, click on 'Forgot Password' on the login page. To update your profile, navigate to your account settings through the profile icon in the top-right corner."
      }
    ]
  },
  {
    id: "payment",
    name: "Payment & EMI",
    questions: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for institutional accounts."
      },
      {
        question: "Do you offer EMI or installment payment options?",
        answer: "Yes, we offer 3, 6, and 12-month EMI options for annual subscriptions with partner banks. The EMI option appears during checkout if your card is from a supported bank."
      },
      {
        question: "Is there a refund policy if I cancel my plan early?",
        answer: "Monthly subscriptions are non-refundable once started. Annual subscriptions can be refunded within 30 days of purchase, minus a processing fee and prorated for any used days."
      },
      {
        question: "Can I pay annually instead of monthly?",
        answer: "Yes, we offer annual payment options with a 20% discount compared to monthly payments. You can select this option during signup or when upgrading your membership."
      }
    ]
  },
  {
    id: "courses",
    name: "Course Types & Formats",
    questions: [
      {
        question: "Are the courses live or self-paced?",
        answer: "We offer both self-paced courses (available anytime) and live cohort-based courses (with scheduled sessions). The course description clearly indicates the format."
      },
      {
        question: "How long do I have access to the course content?",
        answer: "With an active subscription, you have unlimited access to all course content. If you purchase a course individually, you'll have lifetime access regardless of subscription status."
      },
      {
        question: "Do I need to complete the course within a deadline?",
        answer: "Self-paced courses have no deadlines. Cohort-based courses follow a schedule, but you can access the recorded content afterward if you miss any sessions."
      },
      {
        question: "Can I download the course videos or materials?",
        answer: "Course materials like PDFs, worksheets, and code samples are downloadable. Videos are available for offline viewing in the mobile app but cannot be downloaded directly to maintain copyright protection."
      }
    ]
  },
  {
    id: "support",
    name: "General & Support",
    questions: [
      {
        question: "Is there any community or discussion forum I can join?",
        answer: "Yes, every course has a dedicated discussion forum, and we have a platform-wide community where you can connect with peers, ask questions, and share insights. Access it through the 'Community' tab."
      },
      {
        question: "How can I contact support if I face a technical issue?",
        answer: "For technical support, click the 'Help' icon in the bottom-right corner of any page, or email support@creditoracademy.com. Our team typically responds within 24 hours on business days."
      }
    ]
  }
];

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hi there! How can I help you today? You can ask a question or browse our frequently asked questions by category below.",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if it's mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chatbot is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Find answer from FAQ data
  const findFaqAnswer = (question) => {
    // First check for exact question match
    for (const category of faqCategories) {
      for (const faq of category.questions) {
        if (faq.question.toLowerCase() === question.toLowerCase()) {
          return faq.answer;
        }
      }
    }
    
    // Then try to find a partial match using keywords
    const normalizedQuestion = question.toLowerCase();
    
    // Check if keywords match
    const keywords = normalizedQuestion.split(" ").filter(word => word.length > 3);
    
    for (const category of faqCategories) {
      for (const faq of category.questions) {
        // Check for significant keyword matches
        let matchScore = 0;
        for (const keyword of keywords) {
          if (faq.question.toLowerCase().includes(keyword)) {
            matchScore += 1;
          }
        }
        
        // If multiple keywords match, return this answer
        if (matchScore >= 2) {
          return faq.answer;
        }
      }
    }
    
    // Default response if no match
    return "I don't have a specific answer for that question. Please try browsing our FAQ categories below or contact support for more assistance.";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    // Add user message
    setMessages([...messages, { content: inputValue, isUser: true }]);
    setInputValue("");
    setIsTyping(true);
    setShowCategories(false);
    
    // Process message and respond
    setTimeout(() => {
      const botResponse = findFaqAnswer(inputValue);
      setMessages(prev => [...prev, { content: botResponse, isUser: false }]);
      setIsTyping(false);
      
      // Show categories again after bot response
      setTimeout(() => {
        setShowCategories(true);
      }, 500);
    }, 1200);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleQuestionSelect = (question, answer) => {
    // Add the user question as a message
    setMessages(prev => [...prev, { content: question, isUser: true }]);
    
    // Show typing indicator
    setIsTyping(true);
    setShowCategories(false);
    
    // Simulate bot thinking and respond
    setTimeout(() => {
      setMessages(prev => [...prev, { content: answer, isUser: false }]);
      setIsTyping(false);
      setActiveCategory(null);
      
      // Show categories again after bot response
      setTimeout(() => {
        setShowCategories(true);
      }, 500);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast.success("Chat assistant opened");
    }
  };

  if (isMobileView) {
    // Use Sheet for mobile view
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <Button 
            onClick={toggleChatbot} 
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-primary">
                      <Bot className="h-4 w-4 text-white" />
                    </Avatar>
                    <h3 className="font-medium">Support Assistant</h3>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 pr-4 my-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted flex gap-1">
                          <Skeleton className="h-2 w-2 rounded-full animate-pulse" />
                          <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-100" />
                          <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-200" />
                        </div>
                      </div>
                    )}
                    
                    {showCategories && !isTyping && (
                      <div className="mt-4">
                        {activeCategory === null ? (
                          <>
                            <div className="text-sm font-medium mb-2">Browse by category:</div>
                            <div className="flex flex-wrap gap-2">
                              {faqCategories.map(category => (
                                <Badge 
                                  key={category.id}
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-primary/10"
                                  onClick={() => handleCategorySelect(category.id)}
                                >
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{faqCategories.find(c => c.id === activeCategory)?.name}</div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setActiveCategory(null)}
                                className="h-6 text-xs"
                              >
                                Back to categories
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {faqCategories.find(c => c.id === activeCategory)?.questions.map((q, i) => (
                                <Button 
                                  key={i} 
                                  variant="ghost" 
                                  className="w-full justify-start text-left h-auto py-2 text-xs" 
                                  onClick={() => handleQuestionSelect(q.question, q.answer)}
                                >
                                  <ChevronRight size={12} className="mr-2 flex-shrink-0" />
                                  <span className="truncate">{q.question}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      ref={inputRef}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isTyping || inputValue.trim() === ""}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button 
          onClick={toggleChatbot} 
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-80 md:w-96 h-[450px] flex flex-col shadow-xl border-2">
          <div className="p-3 flex items-center justify-between border-b sticky top-0 bg-background">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <Bot className="h-4 w-4 text-white" />
              </Avatar>
              <h3 className="font-medium">Chat Assistant</h3>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <Minimize2 size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted flex gap-1">
                    <Skeleton className="h-2 w-2 rounded-full animate-pulse" />
                    <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-100" />
                    <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-200" />
                  </div>
                </div>
              )}
              
              {showCategories && !isTyping && (
                <div className="mt-4">
                  {activeCategory === null ? (
                    <>
                      <div className="text-sm font-medium mb-2">Browse by category:</div>
                      <div className="flex flex-wrap gap-2">
                        {faqCategories.map(category => (
                          <Badge 
                            key={category.id}
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => handleCategorySelect(category.id)}
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{faqCategories.find(c => c.id === activeCategory)?.name}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setActiveCategory(null)}
                          className="h-6 text-xs"
                        >
                          Back to categories
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {faqCategories.find(c => c.id === activeCategory)?.questions.map((q, i) => (
                          <Button 
                            key={i} 
                            variant="ghost" 
                            className="w-full justify-start text-left h-auto py-2 text-xs" 
                            onClick={() => handleQuestionSelect(q.question, q.answer)}
                          >
                            <ChevronRight size={12} className="mr-2 flex-shrink-0" />
                            <span className="truncate">{q.question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t sticky bottom-0 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                ref={inputRef}
              />
              <Button onClick={handleSendMessage} disabled={isTyping || inputValue.trim() === ""}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default FloatingChatbot;