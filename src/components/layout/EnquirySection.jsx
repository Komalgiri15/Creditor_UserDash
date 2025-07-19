import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";

export function EnquirySection() {
  return (
    <div className="w-full px-3 py-4">
      <Button 
        variant="outline" 
        className="w-full border-dashed border-primary/50 bg-background hover:border-primary hover:bg-primary/5 transition-all group"
        asChild
      >
        <Link to="/faqs">
          <div className="flex items-center justify-center">
            <div className="relative">
              <MessageSquareQuote className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </Link>
      </Button>
    </div>
  );
}

export default EnquirySection;