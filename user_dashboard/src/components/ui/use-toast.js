import { toast } from "sonner";

// Re-export toast from sonner with custom default options
export { toast };

// Add default configuration with better durations and appearance
toast.success = (message, options = {}) => {
  return toast.success(message, { 
    duration: 3000,
    className: "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    ...options 
  });
};

toast.error = (message, options = {}) => {
  return toast.error(message, { 
    duration: 5000, // Longer duration for errors
    className: "border-red-600 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    ...options 
  });
};

toast.warning = (message, options = {}) => {
  return toast.warning(message, { 
    duration: 4000,
    className: "border-amber-600 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
    ...options 
  });
};

toast.info = (message, options = {}) => {
  return toast(message, { 
    duration: 3000,
    className: "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    ...options 
  });
};