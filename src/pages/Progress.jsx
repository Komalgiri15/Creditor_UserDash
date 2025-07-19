import React from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, GraduationCap, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const progressData = [
  {
    courseTitle: "Constitutional Law Fundamentals",
    overallProgress: 62,
    lastAccessed: "2024-04-22",
    totalHours: "25",
    completedHours: "15.5",
    focusAreas: [
      { name: "Readings", value: 80 },
      { name: "Quizzes", value: 65 },
      { name: "Practice", value: 45 },
      { name: "Discussion", value: 60 }
    ]
  },
  {
    courseTitle: "Civil Litigation Procedure",
    overallProgress: 35,
    lastAccessed: "2024-04-21",
    totalHours: "18",
    completedHours: "6.3",
    focusAreas: [
      { name: "Readings", value: 50 },
      { name: "Quizzes", value: 30 },
      { name: "Practice", value: 25 },
      { name: "Discussion", value: 35 }
    ]
  },
  {
    courseTitle: "Criminal Law and Procedure",
    overallProgress: 78,
    lastAccessed: "2024-04-23",
    totalHours: "22",
    completedHours: "17.2",
    focusAreas: [
      { name: "Readings", value: 90 },
      { name: "Quizzes", value: 75 },
      { name: "Practice", value: 70 },
      { name: "Discussion", value: 80 }
    ]
  }
];

const weeklyLearningData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 1.0 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 0.5 },
  { day: "Sat", hours: 3.0 },
  { day: "Sun", hours: 1.8 },
];

const monthlyProgressData = [
  { month: "Jan", progress: 10 },
  { month: "Feb", progress: 25 },
  { month: "Mar", progress: 40 },
  { month: "Apr", progress: 58 },
  { month: "May", progress: 67 },
  { month: "Jun", progress: 67 },
  { month: "Jul", progress: 67 },
];

const skilledAreas = [
  { name: "Constitutional Law", value: 80 },
  { name: "Civil Procedure", value: 35 },
  { name: "Criminal Law", value: 78 },
  { name: "Legal Writing", value: 45 },
  { name: "Contract Law", value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const activityBreakdown = [
  { name: 'Video Lectures', value: 45 },
  { name: 'Reading Materials', value: 25 },
  { name: 'Quizzes & Tests', value: 15 },
  { name: 'Discussions', value: 10 },
  { name: 'Practice Tasks', value: 5 },
];

export function ProgressPage() {
  const totalCourses = progressData.length;
  const completedCourses = progressData.filter(course => course.overallProgress === 100).length;
  const averageProgress = Math.round(
    progressData.reduce((acc, course) => acc + course.overallProgress, 0) / totalCourses
  );
  const totalLearningHours = progressData.reduce(
    (acc, course) => acc + parseFloat(course.completedHours), 
    0
  ).toFixed(1);
  
  const skillProficiencyData = skilledAreas.map(area => ({
    subject: area.name,
    score: area.value,
    fullMark: 100,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Learning Progress</h1>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <p className="text-xs text-muted-foreground">Courses finished</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLearningHours}</div>
                <p className="text-xs text-muted-foreground">Total hours spent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="w-full mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="skills">Skill Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" /> Weekly Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={weeklyLearningData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                          <Bar dataKey="hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" /> Monthly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={monthlyProgressData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Overall Progress']} />
                          <Area 
                            type="monotone" 
                            dataKey="progress" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorProgress)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" /> Learning Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={activityBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {activityBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value) => [`${value}%`, 'Time Spent']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" /> Subject Proficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={skilledAreas}
                          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                          <Bar dataKey="value" fill="#82ca9d" radius={[0, 4, 4, 0]}>
                            {skilledAreas.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="detailed">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Progress Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Last Accessed</TableHead>
                        <TableHead>Hours Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progressData.map((course) => (
                        <TableRow key={course.courseTitle}>
                          <TableCell className="font-medium">{course.courseTitle}</TableCell>
                          <TableCell>
                            <div className="w-[200px]">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">{course.overallProgress}%</span>
                              </div>
                              <Progress value={course.overallProgress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>{new Date(course.lastAccessed).toLocaleDateString()}</TableCell>
                          <TableCell>{course.completedHours}/{course.totalHours} hours</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-3">
                {progressData.map((course) => (
                  <Card key={course.courseTitle} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-md">{course.courseTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{course.overallProgress}% Complete</span>
                        </div>
                        <Progress value={course.overallProgress} className="h-2" />
                      </div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={course.focusAreas} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                            <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="skills">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" /> Overall Skill Proficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={skillProficiencyData}>
                          <CartesianGrid />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#8884d8" 
                            strokeWidth={2} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Skill Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={skilledAreas}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {skilledAreas.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Skill Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skilledAreas.map((skill, index) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-muted-foreground">{skill.value}%</span>
                          </div>
                          <Progress 
                            value={skill.value} 
                            className="h-2" 
                            indicatorColor={COLORS[index % COLORS.length]}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default ProgressPage;