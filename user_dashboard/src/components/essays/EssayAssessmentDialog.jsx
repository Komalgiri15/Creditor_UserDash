import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Undo, Redo, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, HelpCircle } from "lucide-react";

export function EssayAssessmentDialog({ open, onOpenChange }) {
  const [title, setTitle] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [maxAttempts, setMaxAttempts] = useState("1");
  const [category, setCategory] = useState("None");
  const [module, setModule] = useState("None");
  const [grading, setGrading] = useState("Normal");
  const [gradingScale, setGradingScale] = useState("Default");
  const [instructions, setInstructions] = useState("");
  
  // Options tab state
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(false);
  const [enablePlagiarismCheck, setEnablePlagiarismCheck] = useState(false);
  const [enableAutoSave, setEnableAutoSave] = useState(true);
  const [wordCountMin, setWordCountMin] = useState("250");
  const [wordCountMax, setWordCountMax] = useState("1000");
  const [timeLimit, setTimeLimit] = useState("60");

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving essay assessment...");
    onOpenChange(false);
  };

  const toolbarButtons = [
    { icon: Undo, label: "Undo" },
    { icon: Redo, label: "Redo" },
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Image, label: "Insert Image" },
    { icon: HelpCircle, label: "Help" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">Add Essay assessment</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="px-6 py-2">Overview</TabsTrigger>
              <TabsTrigger value="options" className="px-6 py-2">Options</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  placeholder="Enter essay title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxScore" className="text-sm font-medium mb-2 block">
                    Max score
                  </Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="module" className="text-sm font-medium mb-2 block">
                    Module
                  </Label>
                  <Select value={module} onValueChange={setModule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Module 1">Module 1</SelectItem>
                      <SelectItem value="Module 2">Module 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxAttempts" className="text-sm font-medium mb-2 block">
                    Max. attempts
                  </Label>
                  <Select value={maxAttempts} onValueChange={setMaxAttempts}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="grading" className="text-sm font-medium mb-2 block">
                    Grading
                  </Label>
                  <Select value={grading} onValueChange={setGrading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Pass/Fail">Pass/Fail</SelectItem>
                      <SelectItem value="Rubric">Rubric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gradingScale" className="text-sm font-medium mb-2 block">
                    Grading scale
                  </Label>
                  <Select value={gradingScale} onValueChange={setGradingScale}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Default">Default</SelectItem>
                      <SelectItem value="Letter Grade">Letter Grade</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Instructions: <span className="text-red-500">*</span>
                </Label>
                
                {/* Toolbar */}
                <div className="border border-b-0 rounded-t-md bg-gray-50 p-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Select defaultValue="File">
                      <SelectTrigger className="w-16 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="File">File</SelectItem>
                        <SelectItem value="Edit">Edit</SelectItem>
                        <SelectItem value="View">View</SelectItem>
                        <SelectItem value="Insert">Insert</SelectItem>
                        <SelectItem value="Format">Format</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Table">Table</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="Edit">
                      <SelectTrigger className="w-16 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="View">
                      <SelectTrigger className="w-16 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="View">View</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="Insert">
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Insert">Insert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="Format">
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Format">Format</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="Tools">
                      <SelectTrigger className="w-16 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tools">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="Table">
                      <SelectTrigger className="w-16 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Table">Table</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {toolbarButtons.map((button, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title={button.label}
                      >
                        <button.icon className="h-4 w-4" />
                      </Button>
                    ))}
                    
                    <div className="ml-4 flex items-center gap-2">
                      <Select defaultValue="Paragraph">
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paragraph">Paragraph</SelectItem>
                          <SelectItem value="Heading 1">Heading 1</SelectItem>
                          <SelectItem value="Heading 2">Heading 2</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="Poppins">
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times">Times</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="12pt">
                        <SelectTrigger className="w-16 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8pt">8pt</SelectItem>
                          <SelectItem value="10pt">10pt</SelectItem>
                          <SelectItem value="12pt">12pt</SelectItem>
                          <SelectItem value="14pt">14pt</SelectItem>
                          <SelectItem value="16pt">16pt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Text Editor */}
                <div className="border rounded-b-md min-h-[300px] p-4 bg-white">
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter your essay instructions here..."
                    className="w-full h-full min-h-[280px] resize-none border-none outline-none"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Submission Settings</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="late-submissions" 
                      checked={allowLateSubmissions}
                      onCheckedChange={(checked) => setAllowLateSubmissions(checked === true)}
                    />
                    <Label htmlFor="late-submissions" className="cursor-pointer">
                      Allow late submissions
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auto-save" 
                      checked={enableAutoSave}
                      onCheckedChange={(checked) => setEnableAutoSave(checked === true)}
                    />
                    <Label htmlFor="auto-save" className="cursor-pointer">
                      Enable auto-save
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="time-limit" className="text-sm font-medium mb-2 block">
                      Time limit (minutes)
                    </Label>
                    <Input
                      id="time-limit"
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Requirements</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="plagiarism-check" 
                      checked={enablePlagiarismCheck}
                      onCheckedChange={(checked) => setEnablePlagiarismCheck(checked === true)}
                    />
                    <Label htmlFor="plagiarism-check" className="cursor-pointer">
                      Enable plagiarism check
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="word-min" className="text-sm font-medium mb-2 block">
                        Min word count
                      </Label>
                      <Input
                        id="word-min"
                        type="number"
                        value={wordCountMin}
                        onChange={(e) => setWordCountMin(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="word-max" className="text-sm font-medium mb-2 block">
                        Max word count
                      </Label>
                      <Input
                        id="word-max"
                        type="number"
                        value={wordCountMax}
                        onChange={(e) => setWordCountMax(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Assessment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EssayAssessmentDialog;