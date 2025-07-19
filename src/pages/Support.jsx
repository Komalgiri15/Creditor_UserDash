import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Mail, 
  Phone
} from "lucide-react";
import { toast } from "sonner";

export function Support() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Your message has been sent! Our team will respond shortly.");
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
        <p className="text-muted-foreground">
          Need assistance? Our support team is here to help. Please fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Your email address" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your issue in detail" 
                    rows={5} 
                    required 
                  />
                </div>
                
                <div>
                  <Button type="submit" className="w-full md:w-auto">
                    Submit Request
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Live Chat Support</p>
                  <p className="text-sm text-muted-foreground">Available Monday-Friday</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@creditoracademy.com</p>
                  <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">(800) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Monday-Friday, 9 AM - 5 PM EST</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-primary/5 border-primary/10">
            <h3 className="text-lg font-medium mb-2">Support Hours</h3>
            <p className="text-sm mb-4">Our customer service team is available during the following hours:</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Saturday</span>
                <span>10:00 AM - 2:00 PM EST</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Support;