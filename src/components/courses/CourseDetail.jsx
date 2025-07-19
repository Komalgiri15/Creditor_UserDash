import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ChevronLeft, Clock, Film, FileText, LockIcon, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Lesson = ({ id, title, duration, type, completed, locked }) => {
  const Icon = type === "video" ? Film : FileText;
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-md ${locked ? "opacity-60" : "hover:bg-accent"}`}>
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : locked ? (
          <LockIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Icon className="h-5 w-5 text-primary" />
        )}
        <span className={completed ? "text-muted-foreground line-through" : ""}>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{duration}</span>
        {!locked && !completed && (
          <Button variant="ghost" size="sm" className="ml-2">
            <PlayCircle size={16} className="mr-1" />
            Start
          </Button>
        )}
      </div>
    </div>
  );
};

export function CourseDetail() {
  const [activeTab, setActiveTab] = useState("content");

  const modules = [
    {
      id: "1",
      title: "Getting Started",
      description: "Introduction to the course",
      progress: 100,
      units: [
        {
          id: "1-1",
          title: "Introduction",
          lessons: [
            {
              id: "1-1-1",
              title: "Welcome to the course",
              duration: "5:20",
              type: "video",
              completed: true,
              locked: false
            },
            {
              id: "1-1-2",
              title: "How to use this platform",
              duration: "8:45",
              type: "video",
              completed: true,
              locked: false
            }
          ]
        },
        {
          id: "1-2",
          title: "Setup",
          lessons: [
            {
              id: "1-2-1",
              title: "Environment setup",
              duration: "12:30",
              type: "video",
              completed: true,
              locked: false
            },
            {
              id: "1-2-2",
              title: "Installation guide",
              duration: "5 min read",
              type: "text",
              completed: true,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: "2",
      title: "Core Concepts",
      description: "Learn the fundamentals",
      progress: 50,
      units: [
        {
          id: "2-1",
          title: "Basic Principles",
          lessons: [
            {
              id: "2-1-1",
              title: "Understanding the basics",
              duration: "10:15",
              type: "video",
              completed: true,
              locked: false
            },
            {
              id: "2-1-2",
              title: "Key concepts explained",
              duration: "15:40",
              type: "video",
              completed: false,
              locked: false
            }
          ]
        },
        {
          id: "2-2",
          title: "Advanced Topics",
          lessons: [
            {
              id: "2-2-1",
              title: "Diving deeper",
              duration: "18:20",
              type: "video",
              completed: false,
              locked: false
            },
            {
              id: "2-2-2",
              title: "Case studies",
              duration: "12 min read",
              type: "text",
              completed: false,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: "3",
      title: "Practical Applications",
      description: "Hands-on projects and exercises",
      progress: 0,
      units: [
        {
          id: "3-1",
          title: "Project Setup",
          lessons: [
            {
              id: "3-1-1",
              title: "Project initialization",
              duration: "8:50",
              type: "video",
              completed: false,
              locked: true
            },
            {
              id: "3-1-2",
              title: "Configuration guide",
              duration: "7 min read",
              type: "text",
              completed: false,
              locked: true
            }
          ]
        },
        {
          id: "3-2",
          title: "Implementation",
          lessons: [
            {
              id: "3-2-1",
              title: "Building the core features",
              duration: "22:10",
              type: "video",
              completed: false,
              locked: true
            },
            {
              id: "3-2-2",
              title: "Testing and deployment",
              duration: "15:30",
              type: "video",
              completed: false,
              locked: true
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="container py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses">
                <ChevronLeft size={16} />
                Back to courses
              </Link>
            </Button>
            <Badge>Web Development</Badge>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Complete React Developer in 2023</h1>
          
          <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
            <div>Instructor: John Smith</div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>25 hours</span>
            </div>
            <div>42 lessons</div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">62%</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>
        </div>
      </div>
      
      <div className="container py-6 max-w-7xl mx-auto flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="content" onClick={() => setActiveTab("content")}>
              Course Content
            </TabsTrigger>
            <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources" onClick={() => setActiveTab("resources")}>
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Module {module.id}: {module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <Badge variant={module.progress === 100 ? "default" : "outline"}>
                        {module.progress}% Complete
                      </Badge>
                    </div>
                  </div>
                  
                  <Accordion type="multiple" className="px-4 py-2">
                    {module.units.map((unit) => (
                      <AccordionItem key={unit.id} value={unit.id}>
                        <AccordionTrigger className="py-3">
                          <div className="flex items-center">
                            <span>Unit {unit.id.split('-')[1]}: {unit.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {unit.lessons.length} lessons
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1 py-2">
                            {unit.lessons.map((lesson) => (
                              <Lesson 
                                key={lesson.id}
                                id={lesson.id}
                                title={lesson.title}
                                duration={lesson.duration}
                                type={lesson.type} 
                                completed={lesson.completed}
                                locked={lesson.locked}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="overview" className="mt-0">
            <div className="prose max-w-none">
              <h2>About this course</h2>
              <p>
                Just updated with all new React features for 2023! Join a live online community of over 
                600,000+ developers and a course taught by industry experts that have actually worked 
                both in Silicon Valley and Toronto with React.js.
              </p>
              <p>
                Using the latest version of React, this course is focused on efficiency. Never spend time 
                on confusing, out of date, incomplete tutorials anymore. In this course, you'll learn 
                state management, React Hooks, Redux, React Suspense, Concurrency and much more.
              </p>
              
              <h3>What you'll learn</h3>
              <ul>
                <li>Build enterprise level React applications and deploy to production</li>
                <li>Learn to build reactive, performant, large scale applications like a senior developer</li>
                <li>Learn the latest features in React including Hooks, Context API, Suspense, React Lazy + more</li>
                <li>Master the latest ecosystem of a React Developer from scratch</li>
                <li>Using GraphQL as a React Developer</li>
                <li>Use Redux, Redux Thunk and Redux Saga in your applications</li>
                <li>Learn to compare tradeoffs when it comes to different state management</li>
                <li>Set up authentication and user accounts</li>
                <li>Use Firebase to build full stack applications</li>
                <li>Learn to lead React projects by making good architecture decisions</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="prose max-w-none">
              <h2>Course Resources</h2>
              <p>Here are additional resources to help you through this course:</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                  <FileText className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="text-base font-medium m-0">Course Slides</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Downloadable slides for all lectures in PDF format
                    </p>
                    <Button size="sm" variant="outline">Download</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                  <FileText className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="text-base font-medium m-0">Code Repository</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      GitHub repository with all course examples and projects
                    </p>
                    <Button size="sm" variant="outline">View Repository</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md bg-accent/20">
                  <FileText className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="text-base font-medium m-0">Additional Reading</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Recommended articles and documentation to deepen your understanding
                    </p>
                    <Button size="sm" variant="outline">View Resources</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CourseDetail;