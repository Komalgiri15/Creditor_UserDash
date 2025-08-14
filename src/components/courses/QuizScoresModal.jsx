import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar,
  Eye,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { fetchQuizAdminAnalytics, fetchQuizAdminScores } from '@/services/quizServices';
import { fetchCourseUsers } from '@/services/courseService';

const QuizScoresModal = ({ isOpen, onClose, quiz, courseId }) => {
  const [scores, setScores] = useState([]);
  const [adminScores, setAdminScores] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [courseUsers, setCourseUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scores');

  useEffect(() => {
    if (isOpen && quiz?.id) {
      fetchData();
    }
  }, [isOpen, quiz?.id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch only admin endpoints (non-admin endpoints 404 on this backend)
      const [adminScoresData, adminAnalyticsData, usersData] = await Promise.allSettled([
        fetchQuizAdminScores(quiz.id),
        fetchQuizAdminAnalytics(quiz.id),
        fetchCourseUsers(courseId)
      ]);

      // Handle admin scores data
      if (adminScoresData.status === 'fulfilled') {
        setAdminScores(Array.isArray(adminScoresData.value) ? adminScoresData.value : []);
      } else {
        setAdminScores([]);
      }

      // Handle admin analytics data
      if (adminAnalyticsData.status === 'fulfilled') {
        setAdminAnalytics(adminAnalyticsData.value || null);
      } else {
        setAdminAnalytics(null);
      }

      // Handle course users data
      if (usersData.status === 'fulfilled') {
        setCourseUsers(usersData.value || []);
      } else {
        setCourseUsers([]);
      }

    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    if (!adminScores.length) return null;

    const flatAttempts = adminScores.flatMap(u => u.attempts || []);
    if (flatAttempts.length === 0) return null;
    const averageScore = flatAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / flatAttempts.length;
    const passing = flatAttempts.filter(a => a.passed).length;
    const passRate = (passing / flatAttempts.length) * 100;
    const highest = Math.max(...flatAttempts.map(a => a.score || 0));
    const lowest = Math.min(...flatAttempts.map(a => a.score || 0));
    return {
      totalAttempts: flatAttempts.length,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      highestScore: highest,
      lowestScore: lowest,
    };
  };

  const stats = calculateStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{quiz?.title} - Scores & Analytics</h2>
            <p className="text-sm text-gray-600">Quiz performance and user attempts</p>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'scores' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Scores
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analytics' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'attempts' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Attempts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading quiz data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchData} className="mt-4">Retry</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Users className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Attempts</p>
                          <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Target className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Average Score</p>
                          <p className="text-2xl font-bold">{stats.averageScore}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Pass Rate</p>
                          <p className="text-2xl font-bold">{stats.passRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Award className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Highest Score</p>
                          <p className="text-2xl font-bold">{stats.highestScore}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Lowest Score</p>
                          <p className="text-2xl font-bold">{stats.lowestScore}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tab Content */}
              {activeTab === 'scores' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">User Scores</h3>
                  {adminScores.length ? (
                    <div className="space-y-4">
                      {adminScores.map((user) => {
                        const attemptsArr = Array.isArray(user.attempts) ? user.attempts : [];
                        const latestAttempt = attemptsArr
                          .slice()
                          .sort((a, b) => {
                            const dateDiff = new Date(b.attemptDate || 0) - new Date(a.attemptDate || 0);
                            if (dateDiff !== 0) return dateDiff;
                            return (b.attemptNumber || 0) - (a.attemptNumber || 0);
                          })[0];
                        return (
                          <Card key={user.userId}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                      {user?.name?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Attempts: {user.totalAttempts || attemptsArr.length}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {latestAttempt && (
                                    <Badge className={getGradeColor(latestAttempt.score)}>
                                      {getGrade(latestAttempt.score)} ({latestAttempt.score}%)
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {attemptsArr.length ? (
                                <div className="mt-3 space-y-2">
                                  {attemptsArr.map((attempt) => (
                                    <div key={attempt.attemptId} className="flex items-center justify-between border rounded p-2">
                                      <div className="text-sm">
                                        Attempt #{attempt.attemptNumber} • {formatDate(attempt.attemptDate)}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getGradeColor(attempt.score)}>{attempt.score}%</Badge>
                                        {attempt.passed ? (
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : (
                                          <X className="w-4 h-4 text-red-600" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-2">No attempts yet</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : scores.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No scores available yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scores.map((score, index) => {
                        const user = courseUsers.find(u => u.id === score.user_id);
                        const gradeColor = getGradeColor(score.score);
                        const grade = getGrade(score.score);
                        
                        return (
                          <Card key={score.id || index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                      {user?.name?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{user?.name || `User ${score.user_id}`}</p>
                                    <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={gradeColor}>
                                      {grade} ({score.score}%)
                                    </Badge>
                                    {score.score >= (quiz.min_score || 70) ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(score.completed_at || score.created_at)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Quiz Analytics</h3>
                  
                  {adminAnalytics ? (
                    <div className="space-y-6">
                      {/* Quiz Overview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quiz Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{adminAnalytics.totalAttempts}</p>
                              <p className="text-sm text-gray-600">Total Attempts</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{adminAnalytics.totalQuestions}</p>
                              <p className="text-sm text-gray-600">Total Questions</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{adminAnalytics.averageScore}%</p>
                              <p className="text-sm text-gray-600">Average Score</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-600">{adminAnalytics.passPercentage}%</p>
                              <p className="text-sm text-gray-600">Pass Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Pass/Fail Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Passed</span>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-100 text-green-800">
                                    {adminAnalytics.passedCount}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    ({adminAnalytics.passPercentage}%)
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Failed</span>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-red-100 text-red-800">
                                    {adminAnalytics.failedCount}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    ({100 - adminAnalytics.passPercentage}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Score Range</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Highest Score</span>
                                <Badge className="bg-green-100 text-green-800">
                                  {adminAnalytics.highestScore}%
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Lowest Score</span>
                                <Badge className="bg-red-100 text-red-800">
                                  {adminAnalytics.lowestScore}%
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Score Range</span>
                                <span className="text-sm font-medium">
                                  {adminAnalytics.minScore}% - {adminAnalytics.maxScore}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Time Estimate</span>
                                <span className="text-sm font-medium">
                                  {adminAnalytics.timeEstimate} min
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Legacy Analytics (if available) */}
                      {analytics && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Additional Analytics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Score Distribution */}
                              <div>
                                <h4 className="font-medium mb-3">Score Distribution</h4>
                                <div className="space-y-3">
                                  {analytics.scoreDistribution?.map((range, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span className="text-sm">{range.range}</span>
                                      <div className="flex items-center space-x-2">
                                        <Progress value={range.percentage} className="w-24" />
                                        <span className="text-sm text-gray-600">{range.count}</span>
                                      </div>
                                    </div>
                                  )) || (
                                    <p className="text-gray-500">No distribution data available</p>
                                  )}
                                </div>
                              </div>

                              {/* Time Analysis */}
                              <div>
                                <h4 className="font-medium mb-3">Time Analysis</h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-sm">Average Time</span>
                                    <span className="text-sm font-medium">
                                      {analytics.averageTime || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm">Fastest Completion</span>
                                    <span className="text-sm font-medium">
                                      {analytics.fastestTime || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm">Slowest Completion</span>
                                    <span className="text-sm font-medium">
                                      {analytics.slowestTime || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No analytics data available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'attempts' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">User Attempts</h3>
                  {attempts.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No attempts recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attempts.map((attempt, index) => {
                        const user = courseUsers.find(u => u.id === attempt.user_id);
                        
                        return (
                          <Card key={attempt.id || index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                      {user?.name?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{user?.name || `User ${attempt.user_id}`}</p>
                                    <p className="text-sm text-gray-500">Attempt #{attempt.attempt_number || 1}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={attempt.status === 'completed' ? 'default' : 'secondary'}>
                                      {attempt.status || 'in_progress'}
                                    </Badge>
                                    {attempt.score && (
                                      <Badge className={getGradeColor(attempt.score)}>
                                        {attempt.score}%
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(attempt.started_at || attempt.created_at)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScoresModal; 