import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Calendar as CalendarIcon } from "lucide-react";

const attendanceByDate = {
  "2025-06-08": { status: "present", topic: "Constitutional Rights" },
  "2025-06-05": { status: "absent", topic: "Civil Procedure" },
  "2025-06-03": { status: "present", topic: "Criminal Law Basics" },
  "2025-06-01": { status: "present", topic: "Legal Research Methods" },
};

export function AttendanceViewerModal({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateString = selectedDate?.toISOString().split('T')[0];
  const attendanceRecord = selectedDateString ? attendanceByDate[selectedDateString] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Check Attendance
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="font-medium mb-3">Attendance Details</h3>
            {attendanceRecord ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge 
                      variant={attendanceRecord.status === "present" ? "default" : "secondary"}
                      className={attendanceRecord.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {attendanceRecord.status === "present" ? (
                        <UserCheck className="h-3 w-3 mr-1" />
                      ) : (
                        <UserX className="h-3 w-3 mr-1" />
                      )}
                      {attendanceRecord.status === "present" ? "Present" : "Absent"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Topic</span>
                    <span className="text-sm font-medium">{attendanceRecord.topic}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg border bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">No class scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AttendanceViewerModal;