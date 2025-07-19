import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Calendar, Clock, Users, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const allRecordedSessions = [
  {
    id: "1",
    title: "Constitutional Rights Deep Dive",
    date: "2025-06-08",
    duration: "1h 45m",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400",
    instructor: "Prof. Sarah Wilson",
    attendees: 45,
    description: "Comprehensive analysis of constitutional rights and their applications in modern legal practice.",
    driveLink: "https://drive.google.com/file/d/1ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "2",
    title: "Civil Procedure Fundamentals",
    date: "2025-06-05",
    duration: "2h 15m",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400",
    instructor: "Prof. Michael Chen",
    attendees: 38,
    description: "Essential concepts in civil procedure including filing requirements and court procedures.",
    driveLink: "https://drive.google.com/file/d/2ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "3",
    title: "Criminal Law Case Studies",
    date: "2025-06-03",
    duration: "1h 30m",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400",
    instructor: "Prof. Emily Rodriguez",
    attendees: 52,
    description: "Real-world criminal law cases and their implications for legal practice.",
    driveLink: "https://drive.google.com/file/d/3ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "4",
    title: "Contract Law Essentials",
    date: "2025-06-01",
    duration: "2h 00m",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    instructor: "Prof. David Kumar",
    attendees: 41,
    description: "Core principles of contract formation, interpretation, and enforcement.",
    driveLink: "https://drive.google.com/file/d/4ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "5",
    title: "Legal Research Methods",
    date: "2025-05-29",
    duration: "1h 20m",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400",
    instructor: "Prof. Lisa Thompson",
    attendees: 36,
    description: "Advanced techniques for legal research using modern digital tools and databases.",
    driveLink: "https://drive.google.com/file/d/5ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "6",
    title: "Tort Law Workshop",
    date: "2025-05-27",
    duration: "1h 55m",
    thumbnail: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=400",
    instructor: "Prof. Mark Williams",
    attendees: 47,
    description: "Interactive workshop covering negligence, liability, and damages in tort law.",
    driveLink: "https://drive.google.com/file/d/6ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  }
];

function ClassRecordings() {
  const handleVideoClick = (driveLink) => {
    window.open(driveLink, '_blank');
  };

  const handleViewAllRecordings = () => {
    window.open('https://drive.google.com/drive/folders/1ABCDEFGHIJKLMNOPQRSTUVWXYZ_recordings', '_blank');
  };

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Class Recordings</h1>
            <p className="text-muted-foreground">Watch recorded live classes and lectures</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye size={14} />
            {allRecordedSessions.length} recordings available
          </Badge>
          <Button 
            onClick={handleViewAllRecordings}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink size={16} />
            View All Recordings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRecordedSessions.map((session) => (
          <Card 
            key={session.id}
            className="hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
            onClick={() => handleVideoClick(session.driveLink)}
          >
            <div className="relative">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={session.thumbnail} 
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-3">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                {session.duration}
              </Badge>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {session.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {session.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{session.duration}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{session.attendees} attendees</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Instructor: {session.instructor}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ClassRecordings;