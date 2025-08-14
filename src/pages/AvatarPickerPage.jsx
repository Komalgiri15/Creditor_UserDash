import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ChevronLeft, Upload, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfileAvatar, getUserAvatarUrl, notifyAvatarChange, validateAvatarImage } from "@/lib/avatar-utils";
import { updateProfilePicture } from "@/services/userService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Generate professional avatar collections
const generateProfessionalAvatarGrid = (count, baseColor, category, style) => {
  // Professional color palette
  const professionalColors = [
    "8E9196", // professional gray
    "1A1F2C", // dark navy
    "F1F0FB", // soft light gray
    "6E59A5", // professional purple
    "D6BCFA", // light lavender
    "403E43", // charcoal
    "0EA5E9", // business blue
    "9b87f5", // primary purple
  ];

  return Array.from({ length: count }, (_, index) => {
    // Cycle through colors for variety
    const colorIndex = index % professionalColors.length;
    const seed = `professional-${category}-${index + 100}`; // Add offset to create different seeds
    
    return {
      id: `${category}-${index + 1}`,
      src: `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${professionalColors[colorIndex]}`,
      alt: `Professional ${category} avatar ${index + 1}`,
      category,
    };
  });
};

// Add cartoon-style professional avatars
const businessCartoonAvatars = [
  // Business Male Cartoon Style
  { id: "bmc1", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-1&backgroundColor=1A1F2C", alt: "Business man with suit", category: "business-male" },
  { id: "bmc2", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-2&backgroundColor=333&hair=short03", alt: "Business man with glasses", category: "business-male" },
  { id: "bmc3", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-3&backgroundColor=403E43&facialHair=beard", alt: "Business man with beard", category: "business-male" },
  { id: "bmc4", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-4&backgroundColor=0E172A", alt: "Business man professional", category: "business-male" },
  { id: "bmc5", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-5&backgroundColor=1A1F2C&facialHair=beardMustache", alt: "Business man with mustache", category: "business-male" },
  { id: "bmc6", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-male-6&backgroundColor=333&clothingColor=262e33", alt: "Business man in dark suit", category: "business-male" },

  // Business Female Cartoon Style
  { id: "bfc1", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-1&backgroundColor=1A1F2C&clothingColor=262e33", alt: "Business woman with suit", category: "business-female" },
  { id: "bfc2", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-2&backgroundColor=333&hair=long", alt: "Business woman with long hair", category: "business-female" },
  { id: "bfc3", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-3&backgroundColor=403E43&accessories=glasses", alt: "Business woman with glasses", category: "business-female" },
  { id: "bfc4", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-4&backgroundColor=0E172A", alt: "Business woman professional", category: "business-female" },
  { id: "bfc5", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-5&backgroundColor=1A1F2C&hair=bob", alt: "Business woman with bob cut", category: "business-female" },
  { id: "bfc6", src: "https://api.dicebear.com/7.x/personas/svg?seed=business-female-6&backgroundColor=333&hair=pixie", alt: "Business woman with pixie cut", category: "business-female" },
  
  // Alternative cartoon styles
  { id: "not1", src: "https://api.dicebear.com/7.x/notionists/svg?seed=professional-1&backgroundColor=3e4152", alt: "Professional notionist style 1", category: "business-alt" },
  { id: "not2", src: "https://api.dicebear.com/7.x/notionists/svg?seed=professional-2&backgroundColor=2c2f3c", alt: "Professional notionist style 2", category: "business-alt" },
  { id: "not3", src: "https://api.dicebear.com/7.x/notionists/svg?seed=professional-3&backgroundColor=1a1c22", alt: "Professional notionist style 3", category: "business-alt" },
  { id: "lor1", src: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional-1&backgroundColor=3e4152", alt: "Professional lorelei style 1", category: "business-alt" },
  { id: "lor2", src: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional-2&backgroundColor=2c2f3c", alt: "Professional lorelei style 2", category: "business-alt" },
  { id: "lor3", src: "https://api.dicebear.com/7.x/lorelei/svg?seed=professional-3&backgroundColor=1a1c22", alt: "Professional lorelei style 3", category: "business-alt" },
];

// Create professional collections of avatars with appropriate styles
const professionalMaleAvatars = [
  ...businessCartoonAvatars.filter(avatar => avatar.category === "business-male"),
  ...generateProfessionalAvatarGrid(10, "8E9196", "male", "personas"),
  ...generateProfessionalAvatarGrid(8, "1A1F2C", "male", "notionists"),
  ...generateProfessionalAvatarGrid(6, "F1F0FB", "male", "micah")
];

const professionalFemaleAvatars = [
  ...businessCartoonAvatars.filter(avatar => avatar.category === "business-female"),
  ...generateProfessionalAvatarGrid(10, "8E9196", "female", "personas"),
  ...generateProfessionalAvatarGrid(8, "1A1F2C", "female", "notionists"),
  ...generateProfessionalAvatarGrid(6, "F1F0FB", "female", "lorelei")
];

// Add professional alternative styles
const professionalAltAvatars = [
  ...businessCartoonAvatars.filter(avatar => avatar.category === "business-alt"),
  ...generateProfessionalAvatarGrid(6, "333", "alt", "notionists"),
  ...generateProfessionalAvatarGrid(6, "403E43", "alt", "lorelei")
];

function AvatarPickerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get('redirect') || '/profile';
  
  const [selectedAvatar, setSelectedAvatar] = useState(getUserAvatarUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("avatar");
  const [activeAvatarCategory, setActiveAvatarCategory] = useState("male");
  const [customImage, setCustomImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // Reset loading state when component mounts
    setIsLoading(true);
    // Small timeout to ensure the loading state is visible
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (showCameraModal && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCameraModal, cameraStream]);

  const handleSelectAvatar = (avatarSrc) => {
    setSelectedAvatar(avatarSrc);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarImage(file);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      setCustomImage(result);
      setSelectedAvatar(result);
      setActiveTab("photo");
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        setCustomImage(imageData);
        setSelectedAvatar(imageData);
        setUploadedImage(imageData);
        stopCamera();
        toast.success("Photo captured successfully!");
      }
    }
  };

  const handleOpenCamera = async () => {
    setCapturedPhoto(null);
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
    } catch (err) {
      toast.error("Unable to access camera. Please check permissions.");
      setShowCameraModal(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(imageData);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleUsePhoto = () => {
    setCustomImage(capturedPhoto);
    setSelectedAvatar(capturedPhoto);
    setUploadedImage(capturedPhoto);
    setShowCameraModal(false);
    toast.success("Photo captured successfully!");
  };

  const handleSaveAvatar = async () => {
    setSaving(true);
    try {
      let result;
      let newImageUrl;

      if (uploadedImage) {
        // Handle custom uploaded image (from file upload or camera)
        const res = await fetch(uploadedImage);
        const blob = await res.blob();
        const file = new File([blob], "profile-picture.png", { type: blob.type });

        const formData = new FormData();
        formData.append('profilePicture', file);
        
        result = await updateProfilePicture(formData);
        if (result.success) {
          newImageUrl = result.data.imageUrl;
        }
      } else if (selectedAvatar) {
        // Handle pre-made avatar selection
        result = await updateProfileAvatar(selectedAvatar);
        if (result.success) {
          newImageUrl = selectedAvatar;
        }
      } else {
        toast.warning("Please select or upload an avatar.");
        setSaving(false);
        return;
      }

      if (result.success && newImageUrl) {
        toast.success("Avatar updated successfully!");
        
        // Update localStorage and notify components
        localStorage.setItem('userAvatar', newImageUrl);
        notifyAvatarChange();

        // Navigate back
        if (searchParams.get("source")) {
          navigate(searchParams.get("source"));
        } else {
          navigate("/dashboard/profile");
        }
      } else {
        throw new Error(result.message || "An unknown error occurred.");
      }

    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(`Failed to update avatar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    navigate(redirectTo);
  };

  // Get current avatar collection based on active category
  const getCurrentAvatarCollection = () => {
    if (activeAvatarCategory === "alt-style") {
      return professionalAltAvatars;
    }
    return activeAvatarCategory === "male" ? professionalMaleAvatars : professionalFemaleAvatars;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-semibold">Change picture</h1>
              <p className="text-muted-foreground text-sm">Upload a photo, take a picture, or select an avatar.</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        <div className="mt-6">
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={(value) => setActiveTab(value)}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="photo">Upload/Camera</TabsTrigger>
              <TabsTrigger value="avatar">SVG Avatars</TabsTrigger>
            </TabsList>
            
            {/* Photo Upload Tab */}
            <TabsContent value="photo" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 space-y-6">
                <div className="text-center">
                  <p className="text-lg mb-2">Upload an image or take a photo with your camera.</p>
                </div>
                
                {/* Preview of uploaded/captured image */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 shadow-md mb-4">
                  {customImage ? (
                    <img 
                      src={customImage} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Camera Section */}
                {isCameraActive ? (
                  <div className="space-y-4">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-80 h-60 border rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-3">
                      <Button onClick={capturePhoto} className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Capture Photo
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Stop Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {/* Upload button */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button 
                        type="button"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4" />
                          Upload Picture
                        </span>
                      </Button>
                    </label>

                    {/* Camera button */}
                    <Button 
                      onClick={handleOpenCamera}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                )}
                
                {/* Save button */}
                <div className="mt-6">
                  <Button 
                    onClick={handleSaveAvatar}
                    disabled={!customImage && activeTab === "photo"}
                    variant="default"
                    className="w-32"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* SVG Avatar Selection Tab */}
            <TabsContent value="avatar" className="space-y-4">
              <div className="space-y-4">
                <div className="text-xl font-medium mb-2">
                  Click on an avatar to select it.
                </div>
                
                <Tabs 
                  defaultValue={activeAvatarCategory} 
                  onValueChange={setActiveAvatarCategory}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 max-w-xs mb-6">
                    <TabsTrigger value="male">Male</TabsTrigger>
                    <TabsTrigger value="female">Female</TabsTrigger>
                    <TabsTrigger value="alt-style">Alternative</TabsTrigger>
                  </TabsList>
                  
                  {/* Avatars Grid */}
                  <div className="grid grid-cols-6 md:grid-cols-8 gap-3 mb-6">
                    {getCurrentAvatarCollection().map((avatar) => (
                      <div 
                        key={avatar.id}
                        className={cn(
                          "cursor-pointer rounded-full overflow-hidden relative",
                          "transition-all hover:ring-2 hover:ring-primary/70 hover:scale-105",
                          "bg-gradient-to-br from-blue-50 to-blue-100 p-1", // Gradient background
                          selectedAvatar === avatar.src ? "ring-4 ring-primary scale-105" : ""
                        )}
                        onClick={() => handleSelectAvatar(avatar.src)}
                      >
                        {isLoading ? (
                          <Skeleton className="h-14 w-14 rounded-full" />
                        ) : (
                          <div className="rounded-full overflow-hidden bg-white">
                            <img
                              src={avatar.src}
                              alt={avatar.alt}
                              className="w-14 h-14 object-cover rounded-full"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {selectedAvatar === avatar.src && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-full">
                            <Check className="h-5 w-5 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tabs>
                
                {/* Save button */}
                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleSaveAvatar}
                    variant="default"
                    className="w-32 bg-gradient-to-r from-primary to-indigo-400 hover:from-primary/90 hover:to-indigo-500"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
          <DialogContent className="flex flex-col items-center justify-center">
            <DialogHeader>
              <DialogTitle>Take a Photo</DialogTitle>
            </DialogHeader>
            {!capturedPhoto ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-80 h-60 border rounded-lg bg-black mb-4"
                  style={{ background: '#000' }}
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleCapturePhoto} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Capture Photo
                  </Button>
                  <Button variant="outline" onClick={() => setShowCameraModal(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <img src={capturedPhoto} alt="Captured preview" className="w-80 h-60 object-cover rounded-lg border mb-4" />
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={handleRetakePhoto}>Retake</Button>
                  <Button onClick={handleUsePhoto} className="bg-gradient-to-r from-primary to-purple-400">Use Photo</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AvatarPickerPage;