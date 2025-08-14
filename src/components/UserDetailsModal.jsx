import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award,
  MapPin,
  Phone,
  Globe,
  Activity,
  Shield,
  Users,
  GraduationCap,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { fetchUserCoursesByUserId } from "@/services/userService";

const UserDetailsModal = ({ isOpen, onClose, user, isLoading = false, error }) => {
  const [courses, setCourses] = React.useState([]);
  const [loadingCourses, setLoadingCourses] = React.useState(false);
  const [coursesError, setCoursesError] = React.useState(null);

  // Fetch courses for the selected user when modal opens or user changes
  React.useEffect(() => {
    if (isOpen && user?.id) {
      fetchCourses();
    }
  }, [isOpen, user?.id]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const coursesData = await fetchUserCoursesByUserId(user.id);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCoursesError("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            {error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No user data to display.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Helper function to get user role from user_roles array
  const getUserRole = (user) => {
    if (user.user_roles && user.user_roles.length > 0) {
      const roles = user.user_roles.map(r => r.role);
      
      if (roles.includes('admin')) {
        return 'admin';
      } else if (roles.includes('instructor')) {
        return 'instructor';
      } else {
        const role = roles[0];
        return role;
      }
    }
    return 'user';
  };

  // Helper function to calculate time difference and format it
  const calculateTimeDifference = (lastLoginTime) => {
    if (!lastLoginTime) {
      return null;
    }

    const lastLogin = new Date(lastLoginTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - lastLogin.getTime();
    
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Helper function to get last visited from activity_log
  const getLastVisited = (user) => {
    if (user.activity_log && user.activity_log.length > 0) {
      const sortedLogs = user.activity_log.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const lastLoginTime = sortedLogs[0].createdAt;
      return calculateTimeDifference(lastLoginTime);
    }
    return null;
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getPaymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
      case 'declined':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const userRole = getUserRole(user);
  const lastVisited = getLastVisited(user);
  const lastActiveLabel = user.last_login ? formatDate(user.last_login) : (lastVisited || 'Never');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-700">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge className={`mt-2 ${getRoleBadgeColor(userRole)}`}>
                    {userRole}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{user.phone}</span>
                  </div>
                )}

                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">{user.location}</span>
                  </div>
                )}

                {user.dob && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Date of Birth:</span>
                    <span className="text-sm font-medium">
                      {new Date(user.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {user.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Gender:</span>
                    <span className="text-sm font-medium capitalize">{user.gender}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Website:</span>
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}

                {/* Social Handles */}
                {user.social_handles && (
                  <>
                    {user.social_handles.instagram && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Instagram:</span>
                        <a 
                          href={user.social_handles.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {user.social_handles.instagram}
                        </a>
                      </div>
                    )}
                    {user.social_handles.facebook && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Facebook:</span>
                        <a 
                          href={user.social_handles.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {user.social_handles.facebook}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span className="text-sm font-medium">
                    {formatDate(user.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Last Active:</span>
                  <span className="text-sm font-medium">
                    {lastActiveLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default">
                    Active
                  </Badge>
                </div>

                {user.last_login && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Last Login:</span>
                    <span className="text-sm font-medium">
                      {formatDate(user.last_login)}
                    </span>
                  </div>
                )}

                {user.timezone && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Timezone:</span>
                    <span className="text-sm font-medium">{user.timezone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Courses */}
          {loadingCourses ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Available Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Loading courses...</p>
              </CardContent>
            </Card>
          ) : coursesError ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Available Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-500">{coursesError}</p>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Available Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">No courses available.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {courses.map((course, index) => (
                    <div key={course.id || index} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">
                        {course.title}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Payment Status Section */}
          {(Array.isArray(user?.payments) && user.payments.length > 0) || (Array.isArray(user?.subscriptions) && user.subscriptions.length > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Payment Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <div>
                        <h4 className="text-sm font-medium">Payment Status</h4>
                        <p className="text-xs text-gray-500">
                          {user.payment_status || 'Sample payment information'}
                        </p>
                      </div>
                    </div>
                    {getPaymentStatusBadge(user.payment_status || 'completed')}
                  </div>

                  {/* Recent Payments */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Payments</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(user.payments?.length > 0 ? user.payments : [
                        {
                          id: 1,
                          amount: 49.99,
                          description: "Premium Course Payment",
                          status: "completed",
                          createdAt: new Date().toISOString()
                        },
                        {
                          id: 2,
                          amount: 19.99,
                          description: "Basic Course Payment",
                          status: "completed",
                          createdAt: new Date(Date.now() - 86400000).toISOString()
                        }
                      ]).slice(0, 3).map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {payment.description || `Payment #${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(payment.createdAt)} • ${payment.amount}
                            </p>
                          </div>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscriptions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subscriptions</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(user.subscriptions?.length > 0 ? user.subscriptions : [
                        {
                          id: 1,
                          plan_name: "Monthly Subscription",
                          amount: 9.99,
                          interval: "month",
                          status: "active",
                          start_date: new Date(Date.now() - 2592000000).toISOString(),
                          end_date: null
                        }
                      ]).map((sub, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {sub.plan_name || `Subscription Plan`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(sub.start_date)} - {sub.end_date ? formatDate(sub.end_date) : 'Ongoing'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              ${sub.amount}/{sub.interval}
                            </Badge>
                            {getPaymentStatusBadge(sub.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          {/* Activity Information */}
          {user.activity_log && user.activity_log.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {user.activity_log.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action || 'Activity logged'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {user.activity_log.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{user.activity_log.length - 5} more activities
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Enrollments */}
          {user.course_enrollments && user.course_enrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {user.course_enrollments.map((enrollment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {enrollment.course?.title || 'Course'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Enrolled: {formatDate(enrollment.createdAt)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {enrollment.status || 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {user.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{user.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">User ID:</span>
                  <span className="ml-2 font-mono text-xs">{user.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <span className="ml-2">{formatDate(user.updated_at)}</span>
                </div>
                {user.email_verified && (
                  <div>
                    <span className="text-gray-600">Email Verified:</span>
                    <Badge variant="outline" className="ml-2">
                      {user.email_verified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                )}
                {user.two_factor_enabled && (
                  <div>
                    <span className="text-gray-600">2FA Enabled:</span>
                    <Badge variant="outline" className="ml-2">
                      {user.two_factor_enabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
