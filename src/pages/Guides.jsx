import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  FileText,
  Video,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export function Guides() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");


  const guideCategories = [
    { id: "getting-started", name: "Getting Started", count: 8 },
    { id: "courses", name: "Courses & Learning", count: 12 },
    { id: "account", name: "Account Settings", count: 5 },
    { id: "billing", name: "Billing & Payments", count: 6 },
    { id: "technical", name: "Technical Support", count: 7 },
  ];

  const allGuides = [
    {
      id: "1",
      title: "Account Setup and Profile Customization",
      description:
        "Learn how to set up your account and customize your profile settings.",
      category: "Getting Started",
      timeToRead: "5 min read",
      type: "article",
      content: "Step-by-step guide to setting up your account, adding avatar, and editing basic preferences..."
    },
    {
      id: "2",
      title: "Navigating the Learning Dashboard",
      description:
        "A complete tour of all dashboard features and how to use them effectively.",
      category: "Getting Started",
      timeToRead: "8 min read",
      type: "video",
      content: "This guide walks you through dashboard layout, widgets, and tools like your activity log..."
    },
    {
      id: "3",
      title: "Course Enrollment and Progress Tracking",
      description:
        "Step-by-step guide to enrolling in courses and tracking your learning progress.",
      category: "Courses & Learning",
      timeToRead: "6 min read",
      type: "article",
      content: "To enroll, head to the Courses tab > Browse. Once enrolled, your progress bar updates live..."
    },
    {
      id: "4",
      title: "Downloading Course Materials for Offline Access",
      description:
        "How to download and access course content when you're offline.",
      category: "Courses & Learning",
      timeToRead: "4 min read",
      type: "article",
      content: "Download any video or document by clicking the download icon near the course title..."
    },
    {
      id: "5",
      title: "Managing Your Billing Information",
      description:
        "Learn how to update payment methods and manage billing preferences.",
      category: "Billing & Payments",
      timeToRead: "7 min read",
      type: "video",
      content: "To update payment info, go to Settings > Billing > Payment Method and click Edit..."
    },
    {
      id: "6",
      title: "Accessibility Features for All Users",
      description:
        "Discover the accessibility features available throughout the platform.",
      category: "Technical Support",
      timeToRead: "10 min read",
      type: "article",
      content: "We've included screen reader support, keyboard shortcuts, contrast toggle..."
    },
  ];

  const filteredGuides = allGuides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || guide.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  const renderGuideCard = (guide) => (
    <div
      key={guide.id}
      onClick={() => setSelectedGuide(guide)}
      className="cursor-pointer"
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center mb-3">
            {guide.type === "article" ? (
              <FileText size={16} className="text-primary mr-2" />
            ) : (
              <Video size={16} className="text-primary mr-2" />
            )}
            <span className="text-xs text-muted-foreground">{guide.type}</span>
          </div>

          <h3 className="font-medium mb-2">{guide.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {guide.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline">{guide.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {guide.timeToRead}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Guides</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive guides to help you make the most of our
          platform.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search guides and tutorials..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button
        variant={selectedCategory === "All" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => setSelectedCategory("All")}
      >
        All Guides
      </Button>
      {guideCategories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.name ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setSelectedCategory(category.name)}
        >
          {category.name}
          <span className="ml-1 text-xs text-muted-foreground">
            ({category.count})
          </span>
        </Button>

        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="popular">Popular Guides</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
          <TabsTrigger value="quick">Quick Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.slice(0, 6).map(renderGuideCard)}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.slice(3, 9).map(renderGuideCard)}
          </div>
        </TabsContent>
        <TabsContent value="quick" className="pt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Quick Tips</h3>
            <div className="space-y-4">
              {[
                ["Keyboard Shortcuts", "Use Ctrl+F / ⌘+F to search content"],
                ["Save for Later", "Bookmark any course for quick access"],
                ["Dark Mode", "Toggle via Profile > Preferences"],
                ["Course Progress", "Resume from dashboard with 1-click"],
              ].map(([title, desc], idx) => (
                <div className="flex items-start" key={idx}>
                  <CheckCircle2
                    size={18}
                    className="text-primary mt-0.5 mr-3"
                  />
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/10 overflow-hidden">
        <div className="md:flex">
          <div className="p-6 md:w-3/4">
            <h3 className="text-lg font-medium mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-sm mb-4">
              Our support team is always ready to help with any questions you
              might have.
            </p>
            <Button asChild>
              <Link to="/support">
                Contact Support
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          <div className="bg-primary/10 p-6 flex items-center justify-center md:w-1/4">
            <BookOpen size={48} className="text-primary" />
          </div>
        </div>
      </Card>

      {/* Modal */}
      {selectedGuide && (
        <Dialog
          open={!!selectedGuide}
          onOpenChange={() => setSelectedGuide(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGuide.title}</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <span>{selectedGuide.timeToRead} • {selectedGuide.category}</span>
                <Badge variant="secondary" className="capitalize">{selectedGuide.type}</Badge>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>{selectedGuide.description}</p>
              <p>{selectedGuide.content}</p>
              <p>Still stuck? Contact support or check our video library.</p>
            </div>
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button variant="outline">Back</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Guides;
