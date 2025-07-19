import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// import ChatbotContainer from "@/components/layout/ChatbotContainer";

import DashboardLayout from "@/layouts/DashboardLayout";
import  Dashboard  from "@/pages/Dashboard";
import  Courses  from "@/pages/Courses";
import  ModulesList  from "@/pages/ModulesList";
import  ModuleDetail  from "@/pages/ModuleDetail";
import  LessonDetail  from "@/pages/LessonDetail";
import  LessonView  from "@/pages/LessonView";
import  QuizView  from "@/pages/QuizView";
import QuizTypePage from "@/pages/QuizTypePage";
import QuizInstructionPage from "@/pages/QuizInstructionPage";
import QuizTakePage from "@/pages/QuizTakePage";
import QuizResultsPage from "@/pages/QuizResultsPage";
import AssignmentInstructionPage from "@/pages/AssignmentInstructionPage";
import AssignmentTakePage from "@/pages/AssignmentTakePage";
import AssignmentResultsPage from "@/pages/AssignmentResultsPage";
import EssayInstructionPage from "@/pages/EssayInstructionPage";
import EssayTakePage from "@/pages/EssayTakePage";
import EssayResultsPage from "@/pages/EssayResultsPage";
import  Groups  from "@/pages/Groups";
import Catalog from "@/pages/Catalog";
import CatelogCourses from "@/pages/CatelogCourses";

import Progress from "@/pages/Progress";
import Messages from "@/pages/Messages";
import  Profile  from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import CourseView from "@/pages/CourseView";
import ModuleLessonsView from "@/pages/ModuleLessonsView";
import ModuleAssessmentsView from "@/pages/ModuleAssessmentsView";
import CourseEnrollment from "@/pages/CourseEnrollment";
import GroupLayout from "@/layouts/GroupLayout";
import NewsPage from "@/pages/group/NewsPage";
import GroupCalendarPage from "@/pages/group/CalendarPage";
import AnnouncementPage from "@/pages/group/AnnouncementPage";
import ChatPage from "@/pages/group/ChatPage";
import  SpeechifyReaderView  from "@/pages/SpeechifyReaderView";
import AvatarPickerPage from "@/pages/AvatarPickerPage";
import FAQs from "@/pages/FAQs";
import Support from "@/pages/Support";
import Privacy from "@/pages/Privacy";
import Guides from "@/pages/Guides";
import SupportTicket from "@/pages/SupportTicket";
import Announcements from "@/pages/Announcements";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFailed from "@/pages/PaymentFailed";
import AssignmentSubmit from "@/pages/AssignmentSubmit";
import AssignmentSubmissions from "@/pages/AssignmentSubmissions";
import DebateView from "@/pages/DebateView";
import SurveyView from "@/pages/SurveyView";
import DemoQuizPage from "@/pages/DemoQuizPage";
import CalendarPage from "@/pages/CalendarPage";
import TodoPage from "@/pages/TodoPage";
import ClassRecordings from "@/pages/ClassRecordings";
import CertificatePage from "../src/pages/CertificatePage";
import SurveyInstructionPage from "@/pages/SurveyInstructionPage";
import DebateInstructionPage from "@/pages/DebateInstructionPage";
import DebateTakePage from "@/pages/DebateTakePage";
import Games from "@/pages/Games";
import GameDetailView from "@/components/games/GameDetailView";
import MyTickets from "@/pages/MyTickets";
import ScormPage from "@/pages/ScormPage";
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import Instructorpage from "@/pages/Instructorpage";

function ProtectedScormRoute() {
  if (!allowedScormUserIds.includes(currentUserId)) {
    return <div style={{padding: 24}}><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>;
  }
  return <ScormPage />;
}
import Scrompack from "@/pages/Scrompack";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseView />} />
          <Route path="certificate/:courseId" element={<CertificatePage />} />
          <Route path="courses/modules" element={<ModulesList />} />
          <Route path="courses/module/:moduleId" element={<ModuleDetail />} />
          <Route path="courses/module/:moduleId/lessons" element={<ModuleLessonsView />} />
          <Route path="courses/module/:moduleId/assessments" element={<ModuleAssessmentsView />} />
          <Route path="courses/module/:moduleId/lesson/:lessonId" element={<LessonView />} />
          <Route path="courses/module/:moduleId/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="courses/module/:moduleId/lesson/:lessonId/lesson/:lessonId" element={<LessonView />} />
          <Route path="quiz/:quizType" element={<QuizTypePage />} />
          <Route path="quiz-instruction/:quizId" element={<QuizInstructionPage />} />
          <Route path="quiz-take/:quizId" element={<QuizTakePage />} />
          <Route path="quiz-results/:quizId" element={<QuizResultsPage />} />
          <Route path="assignment-instruction/:assignmentId" element={<AssignmentInstructionPage />} />
          <Route path="assignment-take/:assignmentId" element={<AssignmentTakePage />} />
          <Route path="assignment-results/:assignmentId" element={<AssignmentResultsPage />} />
          <Route path="essay-instruction/:essayId" element={<EssayInstructionPage />} />
          <Route path="essay-take/:essayId" element={<EssayTakePage />} />
          <Route path="essay-results/:essayId" element={<EssayResultsPage />} />
          <Route path="demo-quiz/:assessmentTitle" element={<DemoQuizPage />} />
          <Route path="survey-instruction/:surveyId" element={<SurveyInstructionPage />} />
          <Route path="survey/:moduleId/:surveyId" element={<SurveyView />} />
          <Route path="debate-instruction/:debateId" element={<DebateInstructionPage />} />
          <Route path="debate-take/:debateId" element={<DebateTakePage />} />
          <Route path="assignment/:assignmentId/submit" element={<AssignmentSubmit />} />
          <Route path="assignment/:assignmentId/submissions" element={<AssignmentSubmissions />} />
          <Route path="debate/:debateId" element={<DebateView />} />
          <Route path="class-recordings" element={<ClassRecordings />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId/*" element={<GroupLayout />}>
            <Route path="news" element={<NewsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="calendar" element={<GroupCalendarPage />} />
            <Route path="announcements" element={<AnnouncementPage />} />
            <Route path="*" element={<NewsPage />} />
          </Route>
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/category/:categoryName" element={<CatelogCourses />} />
          <Route path="course-enrollment/:courseId" element={<CourseEnrollment />} />
          <Route path="payment-success/:courseId" element={<PaymentSuccess />} />
          <Route path="payment-failed/:courseId" element={<PaymentFailed />} />
          <Route path="progress" element={<Progress />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="avatar-picker" element={<AvatarPickerPage />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="support" element={<Support />} />
          <Route path="guides" element={<Guides />} />
          <Route path="support/ticket" element={<SupportTicket />} />
          <Route path="support/tickets" element={<MyTickets />} />
          <Route path="scorm" element={<ProtectedScormRoute />} />
          <Route path="instructor" element={<Instructorpage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/scorm/:courseId" element={<Scrompack />} />

        </Route>
        <Route path="/speechify-reader" element={<SpeechifyReaderView />} />
        <Route path="/games" element={<Games />} />
      </Routes>
      <Toaster />
      {/** <ChatbotContainer /> */}
    </ThemeProvider>
  );
}

export default App;