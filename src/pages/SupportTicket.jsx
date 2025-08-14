import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  File,
  Upload,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getAuthHeader } from "@/services/authHeader";
import axios from "axios";
import { createTicket } from "@/services/ticketService";

function SupportTicket() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    subject: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.priority) newErrors.priority = "Please select a priority";
      if (!formData.subject.trim()) newErrors.subject = "Please enter a subject";
      if (!formData.description.trim()) newErrors.description = "Please enter a description";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority.toUpperCase());
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('description', formData.description);
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formDataToSend.append('attachments', files[i]);
        }
      }

      const response = await createTicket(formDataToSend, getAuthHeader());
      
      // Extract ticket ID from response if available
      if (response?.data?.data?.id) {
        setTicketId(response.data.data.id);
      }
      
      toast.success("Support ticket submitted successfully!");
      setFormData({
        category: "",
        priority: "",
        subject: "",
        description: ""
      });
      setFiles([]);
      setStep(1);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      if (error.response) {
        toast.error(error.response.data?.errorMessage || error.response.data?.message || "Failed to submit ticket");
      } else {
        toast.error("Failed to submit ticket. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep(1)) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  if (isSubmitted) {
    return (
      <div className="container py-8 max-w-3xl">
        <Card className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Ticket Submitted Successfully</h1>
          <p className="text-muted-foreground mb-6">
            Your support ticket #12495 has been received. We'll get back to you within 24 hours.
          </p>
                     <div className="mb-6 bg-muted p-4 rounded-lg">
             <div className="flex justify-between mb-2">
               <span className="text-sm font-medium">Ticket ID</span>
               <span className="text-sm">#{ticketId || 'Generated'}</span>
             </div>
             <div className="flex justify-between mb-2">
               <span className="text-sm font-medium">Status</span>
               <Badge variant="outline">PENDING</Badge>
             </div>
             <div className="flex justify-between">
               <span className="text-sm font-medium">Estimated Response</span>
               <span className="text-sm">Within 24 hours</span>
             </div>
           </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/support/tickets">
                View All Tickets
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Support Ticket</h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit a support ticket. Our team will respond as soon as possible.
        </p>
      </div>
      
      <Card className="p-6">
        <div className="flex mb-6">
          <div className="w-full flex justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-muted"}`}>
                1
              </div>
              <span className="text-xs mt-1">Details</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-muted"}`}>
                2
              </div>
              <span className="text-xs mt-1">Review</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Ticket Category *</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL_SUPPORT">Technical Support</SelectItem>
                    <SelectItem value="BILLING_PAYMENTS">Billing & Payments</SelectItem>
                    <SelectItem value="ACCOUNT_ISSUES">Account Issues</SelectItem>
                    <SelectItem value="COURSE_CONTENT">Course Content</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority Level *</label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                <Input 
                  id="subject" 
                  placeholder="Brief description of your issue" 
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Detailed Description *</label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide as much detail as possible about your issue" 
                  rows={5} 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            // This is now the review step
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Review Your Ticket</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Ticket Category</label>
                    <p className="capitalize">{formData.category || "Not selected"}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                    <p className="capitalize">{formData.priority || "Not selected"}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                    <p>{formData.subject || "Not provided"}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Detailed Description</label>
                    <p className="text-sm">{formData.description || "Not provided"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  By submitting this ticket, you confirm that the information provided is accurate and relates to a legitimate issue you're experiencing with our platform.
                </p>
              </div>
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

export default SupportTicket;