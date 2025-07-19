import React from "react";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function PaymentFailed() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container py-12 max-w-xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-20 w-20 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment could not be processed. Please try again or contact support if the issue persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(`/course-enrollment/${courseId}`)} 
                variant="default" 
                size="lg"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate("/catalog")} 
                variant="outline" 
                size="lg"
              >
                Back to Catalog
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentFailed;