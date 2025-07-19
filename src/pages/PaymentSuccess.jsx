import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    // Show a success toast when the component mounts
    toast.success("Payment successful!", {
      description: "You have been enrolled in the course"
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container py-12 max-w-xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. You are now enrolled in the course and can start learning immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(`/courses/${courseId}`)} 
                variant="default" 
                size="lg"
              >
                Go to My Course
              </Button>
              <Button 
                onClick={() => navigate("/courses")} 
                variant="outline" 
                size="lg"
              >
                View All My Courses
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentSuccess;