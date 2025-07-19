import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Lightbulb, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardFAQ() {
  // Sample FAQ questions for the dashboard preview
  const previewFaqs = [
    {
      question: "How do I enroll in a course?",
      category: "General"
    },
    {
      question: "Can I download materials for offline use?",
      category: "Courses"
    },
    {
      question: "What payment methods are accepted?",
      category: "Billing"
    }
  ];

  return (
    <Card className="border shadow">
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="bg-amber-500 rounded-full p-1.5">
              <Lightbulb size={14} className="text-white" />
            </div>
            <div className="bg-primary rounded-full p-1.5">
              <BookOpen size={14} className="text-white" />
            </div>
            <div className="bg-emerald-500 rounded-full p-1.5">
              <MessageSquareQuote size={14} className="text-white" />
            </div>
          </div>
          <h3 className="font-medium text-sm">Frequently Asked Questions</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-6 px-2" asChild>
          <Link to="/faqs">View all</Link>
        </Button>
      </div>

      <div className="p-3 space-y-2">
        {previewFaqs.map((faq, index) => (
          <div key={index} className="text-sm border-b last:border-b-0 pb-2 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="font-medium line-clamp-1">{faq.question}</span>
              <span className="text-xs text-muted-foreground">{faq.category}</span>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full border-dashed border-primary/50 bg-background hover:border-primary hover:bg-primary/5 transition-all group mt-2"
          asChild
        >
          <Link to="/faqs">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <MessageSquareQuote className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
              </div>
              <span className="font-medium text-sm">Explore FAQs</span>
            </div>
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default DashboardFAQ;