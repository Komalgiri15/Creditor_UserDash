import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import logoCreditor from "@/assets/logo_creditor.png";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState({ newPassword: false, confirmPassword: false });

  useEffect(() => {
    // Validate that we have the required parameters
    if (!token || !email) {
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/login");
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await axios.post(`${API_BASE}/api/auth/reset-password`, {
      //   token,
      //   email,
      //   newPassword
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 relative overflow-hidden">
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center p-4">
          <Card className="w-full bg-white/95 backdrop-blur-sm border border-blue-100/50 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Password Reset Successful!</h3>
                  <p className="text-slate-600">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>
                </div>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 relative overflow-hidden">
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center p-4">
          <Card className="w-full bg-white/95 backdrop-blur-sm border border-red-100/50 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Invalid Reset Link</h3>
                  <p className="text-slate-600">
                    This password reset link is invalid or has expired. Please request a new one.
                  </p>
                </div>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 relative overflow-hidden">
      {/* Back Button - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBackToLogin} 
          className="flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="transition-transform group-hover:-translate-x-1">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Login
        </Button>
      </div>

      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/25 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-sky-300/15 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto flex items-center justify-center p-4">
        <Card className="w-full bg-white/95 backdrop-blur-sm border border-blue-100/50 shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-blue-200/50">
                <img src={logoCreditor} alt="Creditor Academy" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Creditor Academy</h2>
                <p className="text-xs text-slate-600">Private Education Platform</p>
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-1">Reset Your Password</CardTitle>
              <CardDescription className="text-slate-600">
                Enter your new password below
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, newPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, newPassword: false })}
                    disabled={isLoading}
                    required
                    className={`h-11 px-4 pr-12 border-2 transition-all duration-300 ${
                      isFocused.newPassword 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-slate-200 hover:border-blue-300'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                    tabIndex={-1}
                    onClick={() => setShowNewPassword((v) => !v)}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Password must be at least 8 characters long</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                    disabled={isLoading}
                    required
                    className={`h-11 px-4 pr-12 border-2 transition-all duration-300 ${
                      isFocused.confirmPassword 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-slate-200 hover:border-blue-300'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Reset Password
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-4">
            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs text-slate-600 font-medium">256-bit SSL Encryption</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
