import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lightbulb, BookOpen, Settings, DollarSign, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";

const faqCategories = [
  {
    id: "general",
    name: "General Information",
    icon: Lightbulb,
    color: "text-amber-500",
    questions: [
      {
        question: "How do I enroll in a course?",
        answer: "You can enroll in a course by navigating to the course catalog, selecting your desired course, and clicking on the 'Enroll' button. Payment options will be presented if the course requires payment."
      },
      {
        question: "How do I track my progress?",
        answer: "Your progress is automatically tracked as you complete lessons and assignments. You can view your overall progress on the dashboard or detailed progress on the 'Progress' page."
      },
      {
        question: "How do I join a study group?",
        answer: "You can join existing study groups from the 'Groups' page. Browse available groups, request to join, and wait for approval from the group administrator."
      }
    ]
  },
  {
    id: "courses",
    name: "Courses & Learning",
    icon: BookOpen,
    color: "text-primary",
    questions: [
      {
        question: "Can I download course materials for offline use?",
        answer: "Yes, most course materials can be downloaded for offline use. Look for the download icon next to lectures, readings, and other materials while viewing the course content."
      },
      {
        question: "How do I get a certificate after completing a course?",
        answer: "Certificates are automatically generated once you've completed all required course components. You can access your certificates from the 'Profile' section under 'Achievements'."
      },
      {
        question: "Can I transfer my course progress between devices?",
        answer: "Yes, your progress is stored in your account and will sync automatically across all devices when you log in with the same credentials."
      }
    ]
  },
  {
    id: "technical",
    name: "Technical Support",
    icon: Settings,
    color: "text-teal-500",
    questions: [
      {
        question: "What are the system requirements for the platform?",
        answer: "Our platform is web-based and works on most modern browsers including Chrome, Firefox, Safari, and Edge. We recommend having a stable internet connection for the best experience."
      },
      {
        question: "How can I reset my password?",
        answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your registered email address to create a new password."
      },
      {
        question: "How do I contact support for technical issues?",
        answer: "You can contact our support team through the 'Contact Support' option at the bottom of the FAQs page, or by sending an email to support@creditoracademy.com."
      }
    ]
  },
  {
    id: "billing",
    name: "Billing & Payments",
    icon: DollarSign,
    color: "text-emerald-500",
    questions: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for institutional accounts."
      },
      {
        question: "Can I get a refund?",
        answer: "Refund policies vary by course. Most courses offer a 30-day money-back guarantee if you're not satisfied. Check the specific course details for refund information."
      },
      {
        question: "Do you offer financial aid?",
        answer: "Yes, financial aid is available for eligible students. You can apply for financial assistance through the 'Financial Aid' section in your profile settings."
      }
    ]
  }
];

function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSendQuestion = () => {
    if (customQuestion.trim() === "") {
      toast.error("Please enter your question");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success("Your question has been sent to support. We'll get back to you soon!");
      setCustomQuestion("");
      setIsLoading(false);
    }, 1000);
  };

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = faqCategories.map(category => {
    return {
      ...category,
      questions: category.questions.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }).filter(category => category.questions.length > 0);

  const categoriesToShow = searchQuery
    ? filteredCategories
    : faqCategories.filter(cat =>
        showAll || ["general", "courses", "technical"].includes(cat.id)
      );

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-0">


      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about our platform</p>
      </div>

      <div className="sticky top-4 z-10 mb-6">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {searchQuery && categoriesToShow.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No results found for "{searchQuery}"</p>
          <p className="text-sm">Try a different search term or ask us directly below</p>
        </div>
      )}

      <div className="space-y-6">
        {categoriesToShow.map((category) => (
          <Collapsible
            key={category.id}
            open={activeCategory === category.id || searchQuery !== ""}
            onOpenChange={() => !searchQuery && toggleCategory(category.id)}
            className="bg-card rounded-lg shadow-sm border animate-fade-in"
          >
            <div className="flex items-center p-4 border-b">
              <div className={cn("p-2 rounded-full bg-accent mr-3", category.color.replace("text-", "bg-") + "/10")}>
                <category.icon className={cn("h-5 w-5", category.color)} />
              </div>
              <h2 className="text-lg font-medium flex-1">{category.name}</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className={searchQuery ? "hidden" : ""}>
                  {activeCategory === category.id ? "Hide" : "Show"}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.id}-item-${index}`} className="border-b-0 last:border-0">
                    <AccordionTrigger className="text-left font-medium py-4 hover:no-underline hover:bg-accent/10 px-2 rounded-md">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground px-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {!showAll && !searchQuery && (
        <div className="flex justify-center mt-6">
          <Button size="sm" variant="outline" onClick={() => setShowAll(true)}>
            View All FAQs
          </Button>
        </div>
      )}

      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Ask us anything..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendQuestion} disabled={isLoading}>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                <span>Send</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FAQs;
