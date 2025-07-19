import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonCard } from "@/components/courses/LessonCard";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  Video, 
  FileText, 
  MessageSquare,
  Download,
  Search
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export function LessonContent({ lessons, activeTab, onTabChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResources, setShowAllResources] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Animation effect when switching tabs
  useEffect(() => {
    const contentItems = document.querySelectorAll(".content-item");
    contentItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("animate-fade-in");
        item.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, [activeTab]);
  
  const handleDownload = (resourceName) => {
    toast.success(`Downloading ${resourceName}...`);
  };
  
  const renderResources = () => {
    const resources = [
      { type: 'document', name: 'Context API Documentation', icon: <Book className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'video', name: 'Context API Patterns', icon: <Video className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'pdf', name: 'Context API Cheat Sheet', icon: <FileText className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'document', name: 'React Performance Optimization', icon: <Book className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'video', name: 'Advanced Context Techniques', icon: <Video className="h-5 w-5 mt-1 text-primary" /> },
      { type: 'pdf', name: 'State Management Comparison', icon: <FileText className="h-5 w-5 mt-1 text-primary" /> }
    ];
    
    const filteredResources = selectedResourceType 
      ? resources.filter(r => r.type === selectedResourceType) 
      : resources;
      
    const displayResources = showAllResources ? filteredResources : filteredResources.slice(0, 3);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search resources..." 
              className="w-full max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'document' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'document' ? null : 'document')}
            >
              <Book size={16} className="mr-1" />
              Docs
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'video' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'video' ? null : 'video')}
            >
              <Video size={16} className="mr-1" />
              Videos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={selectedResourceType === 'pdf' ? 'bg-primary/10' : ''}
              onClick={() => setSelectedResourceType(selectedResourceType === 'pdf' ? null : 'pdf')}
            >
              <FileText size={16} className="mr-1" />
              PDFs
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {displayResources.map((resource, index) => (
            <div 
              key={index} 
              className="content-item opacity-0 flex items-start gap-3 p-4 rounded-lg border bg-accent/20 hover:bg-accent/40 transition-all duration-300 hover:shadow-md"
            >
              {resource.icon}
              <div className="flex-1">
                <h3 className="text-base font-medium">{resource.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  {resource.type === 'document' && 'Official documentation resource'}
                  {resource.type === 'video' && 'Video tutorial with examples'}
                  {resource.type === 'pdf' && 'Downloadable PDF guide'}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload(resource.name)}
                  className="flex items-center gap-1"
                >
                  {resource.type === 'document' && 'View Documentation'}
                  {resource.type === 'video' && 'Watch Video'}
                  {resource.type === 'pdf' && (
                    <>
                      <Download size={14} />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
              </div>
              <Badge variant="outline" className="capitalize">{resource.type}</Badge>
            </div>
          ))}
        </div>
        
        {filteredResources.length > 3 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowAllResources(!showAllResources)}>
              {showAllResources ? "Show Less" : "Show All Resources"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="discussions">Discussions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="lessons" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson, index) => (
            <div key={lesson.id} className="content-item opacity-0">
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="resources">
        {renderResources()}
      </TabsContent>
      
      <TabsContent value="discussions">
        <div className="space-y-6">
          <Alert className="bg-primary/10 border-primary/30">
            <AlertTitle className="text-base">Join the discussion</AlertTitle>
            <AlertDescription>
              Ask questions, share insights, and connect with other students learning the same topics.
            </AlertDescription>
          </Alert>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default LessonContent;