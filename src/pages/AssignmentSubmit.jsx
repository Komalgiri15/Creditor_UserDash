import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Upload, FileText, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

export function AssignmentSubmit() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Sample assignment data - in real app this would come from API
  const assignment = {
    id: assignmentId,
    title: "Context Provider Implementation",
    description: "Build a theme provider using React Context API and implement dark/light mode switching",
    dueDate: "2024-02-20",
    points: 100,
    status: "active",
    attachments: ["assignment_guidelines.pdf", "starter_code.zip"]
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit to your API here
    toast.success("Assignment submitted successfully!");
    navigate(`/assignments/${assignmentId}/confirmation`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Assignment
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="submission">Your Submission</Label>
                  <Textarea
                    id="submission"
                    placeholder="Type your submission here or attach files below..."
                    className="min-h-[200px]"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, ZIP (MAX. 20MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Selected Files:</h4>
                      <ul className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between p-2 text-sm bg-gray-50 rounded">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!submissionText && selectedFiles.length === 0}>
                    Submit Assignment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">{assignment.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{assignment.description}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Due {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">{assignment.points} points</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Available until {formatDate(assignment.dueDate)}</span>
                </div>
              </div>

              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium">Attached Files</h4>
                  <ul className="space-y-2">
                    {assignment.attachments.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle file download
                            toast.info(`Downloading ${file}...`);
                          }}
                        >
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                    {assignment.status === "active" ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Due</p>
                  <p className="text-sm text-gray-600">{formatDate(assignment.dueDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmit;