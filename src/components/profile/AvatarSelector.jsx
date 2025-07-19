import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Sliders, Camera, Upload, ImageUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { validateAvatarImage } from "@/lib/avatar-utils";

// Avatar categories
const AVATAR_CATEGORIES = {
  FEMALE: "female",
  MALE: "male",
  ABSTRACT: "abstract",
  BUSINESS_FEMALE: "business-female",
  BUSINESS_MALE: "business-male",
};

// Collection of professional avatar options
const photoAvatarOptions = [
  // Female avatars
  { id: "f1", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", alt: "Professional female portrait 1", category: AVATAR_CATEGORIES.FEMALE },
  { id: "f2", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956", alt: "Professional female portrait 2", category: AVATAR_CATEGORIES.FEMALE },
  { id: "f3", src: "https://images.unsplash.com/photo-1544005313-94ddf02866ab", alt: "Professional female portrait 3", category: AVATAR_CATEGORIES.FEMALE },
  { id: "f4", src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", alt: "Professional female portrait 4", category: AVATAR_CATEGORIES.FEMALE },
  { id: "f5", src: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56", alt: "Professional female portrait 5", category: AVATAR_CATEGORIES.FEMALE },
  
  // Business Female
  { id: "bf1", src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91", alt: "Business female portrait 1", category: AVATAR_CATEGORIES.BUSINESS_FEMALE },
  { id: "bf2", src: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40", alt: "Business female portrait 2", category: AVATAR_CATEGORIES.BUSINESS_FEMALE },
  { id: "bf3", src: "https://images.unsplash.com/photo-1560250097-0b93528c311a", alt: "Business female portrait 3", category: AVATAR_CATEGORIES.BUSINESS_FEMALE },
  { id: "bf4", src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e", alt: "Business female portrait 4", category: AVATAR_CATEGORIES.BUSINESS_FEMALE },
  
  // Male avatars
  { id: "m1", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", alt: "Professional male portrait 1", category: AVATAR_CATEGORIES.MALE },
  { id: "m2", src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5", alt: "Professional male portrait 2", category: AVATAR_CATEGORIES.MALE },
  { id: "m3", src: "https://images.unsplash.com/photo-1560250097-0b93528c311a", alt: "Professional male portrait 3", category: AVATAR_CATEGORIES.MALE },
  { id: "m4", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", alt: "Professional male portrait 4", category: AVATAR_CATEGORIES.MALE },
  { id: "m5", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", alt: "Professional male portrait 5", category: AVATAR_CATEGORIES.MALE },
  
  // Business Male
  { id: "bm1", src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7", alt: "Business male portrait 1", category: AVATAR_CATEGORIES.BUSINESS_MALE },
  { id: "bm2", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", alt: "Business male portrait 2", category: AVATAR_CATEGORIES.BUSINESS_MALE },
  { id: "bm3", src: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f", alt: "Business male portrait 3", category: AVATAR_CATEGORIES.BUSINESS_MALE },
  { id: "bm4", src: "https://images.unsplash.com/photo-1618077360395-f3068be8e001", alt: "Business male portrait 4", category: AVATAR_CATEGORIES.BUSINESS_MALE },
  
  // Abstract avatars
  { id: "a1", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", alt: "Abstract gradient 1", category: AVATAR_CATEGORIES.ABSTRACT },
  { id: "a2", src: "https://images.unsplash.com/photo-1604871000318-22c08a70a54c", alt: "Abstract gradient 2", category: AVATAR_CATEGORIES.ABSTRACT },
  { id: "a3", src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a", alt: "Abstract pattern", category: AVATAR_CATEGORIES.ABSTRACT },
  { id: "a4", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab", alt: "Abstract light", category: AVATAR_CATEGORIES.ABSTRACT },
];

// SVG Avatar data
const dicebearStyles = [
  // Personas style - professional illustrations
  { id: "personas", name: "Personas", example: "https://api.dicebear.com/7.x/personas/svg?seed=sample&backgroundColor=8E9196", category: "modern" },
  { id: "notionists", name: "Notionists", example: "https://api.dicebear.com/7.x/notionists/svg?seed=sample&backgroundColor=1A1F2C", category: "modern" },
  { id: "bottts", name: "Bottts", example: "https://api.dicebear.com/7.x/bottts/svg?seed=sample&backgroundColor=8E9196", category: "fun" },
  { id: "initials", name: "Initials", example: "https://api.dicebear.com/7.x/initials/svg?seed=sample&backgroundColor=333", category: "minimal" },
  { id: "micah", name: "Micah", example: "https://api.dicebear.com/7.x/micah/svg?seed=sample&backgroundColor=1A1F2C", category: "minimal" },
  { id: "adventurer", name: "Adventurer", example: "https://api.dicebear.com/7.x/adventurer/svg?seed=sample", category: "fun" },
  { id: "avataaars", name: "Avataaars", example: "https://api.dicebear.com/7.x/avataaars/svg?seed=sample", category: "fun" },
  { id: "lorelei", name: "Lorelei", example: "https://api.dicebear.com/7.x/lorelei/svg?seed=sample&backgroundColor=1A1F2C", category: "modern" },
  { id: "thumbs", name: "Thumbs", example: "https://api.dicebear.com/7.x/thumbs/svg?seed=sample", category: "fun" },
  { id: "pixel-art", name: "Pixel Art", example: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sample", category: "fun" },
  { id: "identicon", name: "Identicon", example: "https://api.dicebear.com/7.x/identicon/svg?seed=sample", category: "minimal" },
  { id: "shapes", name: "Shapes", example: "https://api.dicebear.com/7.x/shapes/svg?seed=sample", category: "minimal" },
];

export function AvatarSelector({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSelectAvatar
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({});
  const [avatarType, setAvatarType] = useState(
    currentAvatarUrl.includes("dicebear") ? "svg" : 
    currentAvatarUrl.startsWith("data:") ? "custom" : "photos"
  );
  
  const [photoCategory, setPhotoCategory] = useState(AVATAR_CATEGORIES.FEMALE);
  const [svgCategory, setSvgCategory] = useState("modern");
  const [openCustomization, setOpenCustomization] = useState(false);
  const [customImage, setCustomImage] = useState(
    currentAvatarUrl.startsWith("data:") ? currentAvatarUrl : null
  );
  const fileInputRef = useRef(null);
  const isMobile = useIsMobile();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // DiceBear configuration with professional colors
  const [dicebearConfig, setDicebearConfig] = useState({
    style: "personas",
    seed: Math.random().toString(36).substring(2, 10),
    backgroundColor: "8E9196", // Professional gray
    backgroundType: "solid",
    flip: false,
    radius: 0,
    scale: 100
  });

  useEffect(() => {
    // Reset loading state when dialog opens
    if (isOpen) {
      setIsLoading(true);
      setLoadingImages({});
      // Small timeout to ensure the loading state is visible
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isOpen]);

  useEffect(() => {
    // Generate DiceBear URL when configuration changes
    if (avatarType === "svg") {
      const url = generateDicebearUrl(dicebearConfig);
      setSelectedAvatar(url);
    }
  }, [dicebearConfig, avatarType]);

  const generateDicebearUrl = (config) => {
    let url = `https://api.dicebear.com/7.x/${config.style}/svg`;
    url += `?seed=${config.seed}`;
    url += `&backgroundColor=${config.backgroundColor}`;
    url += `&backgroundType=${config.backgroundType}`;
    url += `&flip=${config.flip}`;
    url += `&radius=${config.radius}`;
    url += `&scale=${config.scale}`;
    return url;
  };

  const handleSelectPhotoAvatar = (avatar) => {
    setAvatarType("photos");
    setSelectedAvatar(avatar.src);
  };

  const handleSelectDicebearStyle = (style) => {
    setDicebearConfig({
      ...dicebearConfig,
      style
    });
    setAvatarType("svg");
  };

  const handleRandomizeSeed = () => {
    setDicebearConfig({
      ...dicebearConfig,
      seed: Math.random().toString(36).substring(2, 10)
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateAvatarImage(file);
    if (!validation.valid) {
      toast.error(validation.message || "Invalid image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      setCustomImage(result);
      setSelectedAvatar(result);
      setAvatarType("custom");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    // Save to localStorage to persist across sessions
    if (avatarType === "svg") {
      localStorage.setItem("userAvatar", selectedAvatar);
      localStorage.setItem("avatarConfig", JSON.stringify(dicebearConfig));
    } else {
      localStorage.setItem("userAvatar", selectedAvatar);
      localStorage.removeItem("avatarConfig");
    }
    
    // Notify other components that avatar has changed
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userAvatar-updated"));
    
    onSelectAvatar(selectedAvatar);
    onClose();
    toast.success("Avatar updated successfully");
  };

  // Handle image loading
  const handleImageLoaded = (id) => {
    setLoadingImages(prev => ({
      ...prev,
      [id]: false
    }));
  };
  
  // Mark image as loading
  const handleImageLoading = (id) => {
    setLoadingImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Camera logic
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
    setAvatarType("custom");
    setShowCameraModal(false);
    toast.success("Photo captured successfully!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "flex flex-col max-h-[90vh] sm:max-h-[80vh",
        "w-[95vw] sm:w-auto sm:max-w-4xl",
        "p-4 sm:p-6 gap-4 bg-background"
      )}>
        <DialogHeader>
          <DialogTitle className="text-xl">Choose Your Avatar</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select a professional photo or create a custom avatar
          </DialogDescription>
        </DialogHeader>
        
        {/* Selected avatar preview */}
 <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-24-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 mb-2 shadow-md">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                <img 
                  src={selectedAvatar} 
                  alt="Selected avatar" 
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
            )}
          </div>
        </div>

        <Tabs 
          defaultValue={avatarType} 
          className="flex flex-col flex-1 min-h-0 w-full overflow-hidden"
          onChange={(e) => setAvatarType(e.target.value)}
        >
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Avatars</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Main content area with fixed height for all tabs */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Photo Avatars Tab */}
            <TabsContent 
              value="photos" 
              className="flex flex-col h-full data-[state=active]:flex data-[state=inactive]:hidden"
            >
              <Tabs 
                defaultValue={photoCategory} 
                value={photoCategory}
                onChange={(e) => setPhotoCategory(e.target.value)} 
                className="flex flex-col h-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value={AVATAR_CATEGORIES.FEMALE}>Women</TabsTrigger>
                  <TabsTrigger value={AVATAR_CATEGORIES.BUSINESS_FEMALE}>Business W</TabsTrigger>
                  <TabsTrigger value={AVATAR_CATEGORIES.MALE}>Men</TabsTrigger>
                  <TabsTrigger value={AVATAR_CATEGORIES.BUSINESS_MALE}>Business M</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="flex-1 h-[400px] w-full">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-2">
                      {photoAvatarOptions
                        .filter(avatar => avatar.category === photoCategory)
                        .map((avatar) => (
                          <div 
                            key={avatar.id}
                            className={cn(
                              "cursor-pointer rounded-full overflow-hidden border-2 relative",
                              "transition-all shadow-sm hover:shadow-md",
                              selectedAvatar === avatar.src 
                                ? "border-primary ring-2 ring-primary/20" 
                                : "border-transparent hover:border-muted-foreground/30"
                            )}
                            onClick={() => handleSelectPhotoAvatar(avatar)}
                          >
                            <AspectRatio ratio={1/1} className="bg-muted/50">
                              <div className="h-full w-full relative flex items-center justify-center">
                                {(isLoading || loadingImages[avatar.id]) && (
                                  <Skeleton className="h-full w-full absolute inset-0" />
                                )}
                                <img
                                  src={`${avatar.src}?auto=format&fit=crop&w=300&h=300&q=80`}
                                  alt={avatar.alt}
                                  className="object-cover h-full w-full"
                                  onLoad={() => handleImageLoaded(avatar.id)}
                                  onLoadStart={() => handleImageLoading(avatar.id)}
                                  loading="lazy"
                                  width={300}
                                  height={300}
                                />
                                {selectedAvatar === avatar.src && (
                                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                                    <Check className="text-primary h-6 w-6 drop-shadow-md" />
                                  </div>
                                )}
                              </div>
                            </AspectRatio>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </TabsContent>
            
            {/* SVG Avatars Tab */}
            <TabsContent 
              value="svg" 
              className="h-full m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden flex-col"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
                  <Tabs 
                    defaultValue="modern" 
                    value={svgCategory}
                    onChange={(e) => setSvgCategory(e.target.value)} 
                    className="w-full"
                  >
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="modern">Modern</TabsTrigger>
                      <TabsTrigger value="fun">Fun</TabsTrigger>
                      <TabsTrigger value="minimal">Minimal</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRandomizeSeed}
                    className="whitespace-nowrap"
                    size="sm"
                  >
                    Randomize
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 mt-4">
                <ScrollArea className="flex-1 h-[400px] w-full">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-2">
                    {dicebearStyles
                      .filter(style => style.category === svgCategory)
                      .map((style) => (
                        <div 
                          key={style.id}
                          className={cn(
                            "cursor-pointer rounded-full overflow-hidden border-2 relative",
                            "transition-all shadow-sm hover:shadow-md",
                            dicebearConfig.style === style.id 
                              ? "border-primary ring-2 ring-primary/20" 
                              : "border-transparent hover:border-muted-foreground/30"
                          )}
                          onClick={() => handleSelectDicebearStyle(style.id)}
                        >
                          <AspectRatio ratio={1/1} className="bg-muted/50">
                            <div className="h-full w-full relative flex items-center justify-center">
                              {isLoading && <Skeleton className="h-full w-full absolute inset-0" />}
                              <img
                                src={style.example}
                                alt={style.name}
                                className="object-contain h-full w-full p-1"
                                loading="lazy"
                                width={150}
                                height={150}
                              />
                              {dicebearConfig.style === style.id && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                                  <Check className="text-primary h-6 w-6 drop-shadow-md" />
                                </div>
                              )}
                            </div>
                          </AspectRatio>
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1 text-center text-xs font-medium">
                            {style.name}
                          </div>
                        </div>
                    ))}
                  </div>
                  
                  {/* Advanced customization options */}
                  <Collapsible 
                    open={openCustomization} 
                    onOpenChange={setOpenCustomization}
                    className="w-full max-w-md mx-auto mt-4 border rounded-lg p-2 shadow-sm"
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex w-full justify-between">
                        Advanced Options
                        <Sliders className="h-4 w-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-2 space-y-4 animate-accordion-down">
                      {/* Background Color */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Background</label>
                        <div className="flex space-x-2">
                          {["8E9196", "1A1F2C", "F1F0FB", "333", "000000"].map((color) => (
                            <button 
                              key={color}
                              className={cn(
                                "w-8 h-8 rounded-full cursor-pointer border transition-all",
                                dicebearConfig.backgroundColor === color 
                                  ? "ring-2 ring-primary ring-offset-2 border-transparent" 
                                  : "border-border hover:border-primary/50"
                              )}
                              style={{ backgroundColor: `#${color}` }}
                              onClick={() => setDicebearConfig({ ...dicebearConfig, backgroundColor: color })}
                              aria-label={`Color #${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Scale */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Scale</label>
                          <span className="text-xs text-muted-foreground">{dicebearConfig.scale}%</span>
                        </div>
                        <Slider 
                          value={[dicebearConfig.scale]} 
                          min={50} 
                          max={150} 
                          step={5}
                          onValueChange={(value) => setDicebearConfig({ ...dicebearConfig, scale: value[0] })}
                          className="py-2"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Custom Upload Tab */}
            <TabsContent 
              value="custom" 
              className="h-full m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden flex-col"
            >
              <div className="flex-1 min-h-0">
                <ScrollArea className="flex-1 h-[400px] w-full">
                  <div className="flex flex-col items-center justify-center p-4 space-y-6">
                    {/* Preview of uploaded image */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                      {customImage ? (
                        <img 
                          src={customImage} 
                          alt="Uploaded avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Upload button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {customImage ? "Change Image" : "Upload Image"}
                      </Button>
                      <Button 
                        onClick={handleOpenCamera}
                        className="flex items-center gap-2"
                        variant="outline"
                      >
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      <p>Upload a personal photo for your avatar or take a new one</p>
                      <p className="text-xs mt-1">Maximum file size: 5MB</p>
                      <p className="text-xs">Supported formats: JPEG, PNG, GIF</p>
                    </div>
                  </div>
                </ScrollArea>
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
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-auto pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveAvatar} className="bg-gradient-to-r from-primary to-purple-400">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarSelector;