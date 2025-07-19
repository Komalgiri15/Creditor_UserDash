import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster as SonnerToaster } from 'sonner' // Aliased to avoid confusion with shadcn Toaster

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <SonnerToaster 
      position="top-right" 
      closeButton 
      richColors 
      theme="light" // Changed from "system" to "light"
      toastOptions={{
        duration: 4000,
        className: "rounded-md border shadow-lg"
      }}
    />
  </BrowserRouter>
);