import React, { useState } from "react";
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

function SupportTicket() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Your support ticket has been submitted!");
    }, 1500);
  };

  const nextStep = () => {
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
              <span className="text-sm">#12495</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="outline">Open</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Estimated Response</span>
              <span className="text-sm">Within 24 hours</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Return to Dashboard
            </Button>
            <Button onClick={() => window.location.href = "/support/tickets"}>
              View All Tickets
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
              <span className="text-xs mt-1">Attachments</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`h-1 w-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-muted"}`}>
                3
              </div>
              <span className="text-xs mt-1">Review</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Ticket Category</label>
                <Select defaultValue="technical">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="course">Course Content</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority Level</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="Brief description of your issue" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Detailed Description</label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide as much detail as possible about your issue" 
                  rows={5} 
                  required 
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Attachments (Optional)</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">Maximum file size: 10MB. Supported formats: JPG, PNG, PDF, ZIP</p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attached Files</label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-3 rounded">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Review Your Ticket</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Ticket Category</label>
                    <p>Technical Support</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                    <p>Medium</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                    <p>Issue with accessing course videos</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Detailed Description</label>
                    <p className="text-sm">I've been trying to access the video lectures for the Constitutional Law Fundamentals course, but they keep buffering and sometimes don't load at all. I've tried using different browsers and devices but the issue persists. This has been happening since yesterday.</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                    {files.length > 0 ? (
                      <div className="space-y-1">
                        {files.map((file, index) => (
                          <p key={index} className="text-sm flex items-center">
                            <File className="h-3 w-3 mr-1" />
                            {file.name}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">No attachments</p>
                    )}
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