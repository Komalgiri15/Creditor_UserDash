import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, BookOpen, Users, Award } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchUserProfile, setUserRole, setUserRoles } from "@/services/userService";
import logoCreditor from "@/assets/logo_creditor.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [animateCard, setAnimateCard] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Trigger card animation on mount
    setAnimateCard(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true, // Important for cookies
      });

      console.log('Login response from backend:', response.data);

      if (response.data.success && response.data.token) {
        // Store token in both cookies and localStorage for better compatibility
        const token = response.data.token;
        
        // Store in cookies for 30 days (same as backend)
        Cookies.set("token", token, { 
          expires: 30,
          secure: window.location.protocol === 'https:',
          sameSite: 'lax'
        });
        
        // Also store in localStorage as backup
        localStorage.setItem("token", token);
        
        // Dispatch custom event to notify UserContext
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        // Set default role first
        setUserRole('user');
        
        // Wait a brief moment for token to be available, then fetch user profile
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile();
            console.log('Fetched user profile after login:', profile);
            if (profile && Array.isArray(profile.user_roles) && profile.user_roles.length > 0) {
              // Extract role names and use the highest priority role (admin > instructor > user)
              const roles = profile.user_roles.map(roleObj => roleObj.role);
              const priorityRoles = ['admin', 'instructor', 'user'];
              const highestRole = priorityRoles.find(role => roles.includes(role)) || 'user';
              
              // Set single role (enforces single role system)
              setUserRoles([highestRole]);
              console.log('Set user single role to:', highestRole);
            } else {
              // If no roles found, set default user role
              setUserRoles(['user']);
            }
          } catch (profileErr) {
            console.warn("Could not fetch user profile:", profileErr);
            // Keep default 'user' role
            setUserRoles(['user']);
          }
        }, 100); // Small delay to ensure token is available
        
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className={`shadow-2xl border-0 ${animateCard ? 'animate-in slide-in-from-bottom-4 duration-500' : ''}`}>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img src={logoCreditor} alt="Creditor Academy" className="h-12" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account to continue your learning journey
                </CardDescription>
            </CardHeader>
          <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                    placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    />
                    <button
                      type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                  <div className="flex items-center justify-center">
                      Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>Don't have an account? Contact your administrator</p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span>LMS Portal</span>
                </div>
              </div>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}

export default Login;