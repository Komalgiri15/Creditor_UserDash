// Define constants for types that were previously enums or union types
export const LESSON_TYPES = {
  VIDEO: "video",
  TEXT: "text",
  PDF: "pdf",
  PRESENTATION: "presentation",
  IMAGE: "image"
};

export const QUIZ_STATUS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed"
};

export const ASSIGNMENT_STATUS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  SUBMITTED: "submitted",
  GRADED: "graded"
};

// Define default values for objects that would have had these types
export const DEFAULT_LESSON = {
  id: "",
  moduleId: "",
  lessonId: "",
  title: "",
  description: "",
  type: LESSON_TYPES.TEXT,
  duration: "0 min",
  completed: false,
  locked: false,
  thumbnail: undefined,
  videoUrl: undefined,
  content: ""
};

export const DEFAULT_QUIZ = {
  id: "",
  moduleId: "",
  lessonId: "",
  title: "",
  description: "",
  questionCount: 0,
  duration: "0 min",
  status: QUIZ_STATUS.NOT_STARTED,
  passingScore: 0,
  dueDate: undefined,
  score: undefined
};

export const DEFAULT_ASSIGNMENT = {
  id: "",
  moduleId: "",
  lessonId: "",
  title: "",
  description: "",
  dueDate: "",
  status: ASSIGNMENT_STATUS.NOT_STARTED,
  estimatedTime: "0 min",
  score: undefined,
  maxScore: 0,
  fileCount: 0
};

// Helper functions to validate types
export const isValidLessonType = (type) => {
  return Object.values(LESSON_TYPES).includes(type);
};

export const isValidQuizStatus = (status) => {
  return Object.values(QUIZ_STATUS).includes(status);
};

export const isValidAssignmentStatus = (status) => {
  return Object.values(ASSIGNMENT_STATUS).includes(status);
};

// Export all as a single object for convenience
export const LessonTypes = {
  ...LESSON_TYPES,
  QUIZ_STATUS,
  ASSIGNMENT_STATUS,
  DEFAULT_LESSON,
  DEFAULT_QUIZ,
  DEFAULT_ASSIGNMENT,
  isValidLessonType,
  isValidQuizStatus,
  isValidAssignmentStatus
};

export default LessonTypes;