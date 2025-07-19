  import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ChevronLeft, Download, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock course data - in real app this would come from API
const getCourseData = (courseId) => {
  const courses = {
    "react-2023": {
      title: "Complete React Developer in 2023",
      completionDate: "15 Aug 2023",
      instructor: "John Smith"
    },
    "python-data": {
      title: "Python for Data Science", 
      completionDate: "22 Jul 2023",
      instructor: "Michael Chen"
    }
  };
  return courses[courseId];
};

export function CertificatePage() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const course = getCourseData(courseId || "");
  const userName = "Alex Johnson";

  if (!course) {
    return (
      <div className="container py-6">
        <p>Course not found</p>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const certificateElement = document.getElementById("certificate-content");
    if (certificateElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate - ${course.title}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: white; }
                .certificate-container {
                  width: 100%;
                  max-width: 800px;
                  margin: 0 auto;
                }
                @media print {
                  body { padding: 0; }
                  .certificate-container { max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="certificate-container">
                ${certificateElement.outerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }

    toast({
      title: "Download Started",
      description: "Your certificate is being prepared for download."
    });
  };

  const handleShare = (platform) => {
    let url = "";
    const certificateUrl = `${window.location.origin}/certificate/${courseId}`;

    switch (platform) {
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          certificateUrl
        )}`;
        break;
      case "gmail":
        url = `mailto:?subject=My Certificate&body=Check out my certificate: ${certificateUrl}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=Check out my certificate: ${certificateUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=I just completed ${course.title}!&url=${certificateUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(certificateUrl);
        toast({
          title: "Link Copied",
          description: "Certificate link copied to clipboard!"
        });
        return;
    }

    if (url) {
      window.open(url, "_blank");
    }
    setIsShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/courses">
              <ChevronLeft size={16} />
              Back to courses
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold">Your Certificate</h1>

            <Card className="p-6 bg-white shadow-lg">
              <CardContent className="p-0">
                <div
                  id="certificate-content"
                  className="text-center space-y-4 border-8 border-blue-600 p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden aspect-[4/3]"
                >
                  <div className="absolute top-4 left-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20"></div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-orange-400 rounded-full opacity-20"></div>

                  <div className="space-y-1">
                    <div className="text-xs text-blue-600 font-medium tracking-wide">Creditor Academy</div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Certificate of</h2>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">Completion</h1>
                  </div>

                  <div className="py-3">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{userName}</div>
                    <div className="w-40 h-px bg-gray-400 mx-auto"></div>
                  </div>

                  <div className="space-y-1 text-gray-700">
                    <p className="text-xs">has successfully completed the online course</p>
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-xs leading-relaxed">
                      This professional has demonstrated initiative and a<br />
                      commitment to developing their skills and advancing<br />
                      their career. Well done!
                    </p>
                  </div>

                  <div className="flex justify-between items-end pt-4">
                    <div className="text-left">
                      <p className="text-xs font-semibold">Date: {course.completionDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mb-1">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold">Course Advisor</p>
                        <p>CEO, Creditor Academy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Share your Achievement!</h2>
            <p className="text-muted-foreground">
              Get new opportunities by sharing the certificate on LinkedIn and other platforms
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleDownloadPDF}
                className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Download className="mr-2" size={20} />
                Download as PDF
              </Button>

              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full h-12 text-lg" size="lg">
                    <Share2 className="mr-2" size={20} />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Certificate</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {[
                      { platform: "linkedin", color: "blue-600", label: "in" },
                      { platform: "gmail", color: "red-600", label: "@" },
                      { platform: "whatsapp", color: "green-600", label: "W" },
                      { platform: "twitter", color: "blue-400", label: "T" }
                    ].map(({ platform, color, label }) => (
                      <Button
                        key={platform}
                        variant="outline"
                        className={`flex flex-col items-center gap-2 h-20 border-2 hover:border-${color}`}
                        onClick={() => handleShare(platform)}
                      >
                        <div className={`w-8 h-8 bg-${color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{label}</span>
                        </div>
                        <span className="text-sm capitalize">{platform}</span>
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => handleShare("copy")}>
                    <Copy className="mr-2" size={16} />
                    Copy Link
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
