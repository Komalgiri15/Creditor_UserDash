import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function BackButton({ label = "Back", className = "" }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This navigates back to the previous route
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleGoBack} 
        className={`flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 group ${className}`}
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        {label}
      </Button>
    </motion.div>
  );
}

export default BackButton;