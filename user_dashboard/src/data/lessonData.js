export const lessonLessons = [
  {
    id: "1",
    moduleId: "2",
    lessonId: "1",
    title: "Introduction to Context API",
    description: "Learn about the React Context API and its use cases",
    type: "text",
    duration: "8 min read",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
    videoUrl: "",
    content: `
      <h2>Introduction to React Context API</h2>
      <p>The React Context API provides a way to pass data through the component tree without having to pass props down manually at every level.</p>
      
      <h3>When to Use Context</h3>
      <ul>
        <li>Theme data (dark mode, light mode)</li>
        <li>User authentication state</li>
        <li>Language/locale settings</li>
        <li>Application-wide settings</li>
      </ul>
    `
  },
  {
    id: "2",
    moduleId: "2",
    lessonId: "1",
    title: "Creating a Context",
    description: "Learn how to create a context and provide it to your component tree.",
    type: "video",
    duration: "18:45",
    completed: true,
    locked: false,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    content: `
      <h2>Creating a Context in React</h2>
      <p>React's Context API provides a way to share values like themes, user data, or any other application state between components.</p>
    `
  }
];

export const lessonQuizzes = [
  {
    id: "1",
    moduleId: "2",
    lessonId: "1",
    title: "Context API Quiz",
    description: "Test your understanding of Context API concepts",
    questionCount: 5,
    duration: "10 min",
    status: "not-started",
    passingScore: 80
  }
];

export const lessonAssignments = [
  {
    id: "1",
    moduleId: "2",
    lessonId: "1",
    title: "Build a Theme Provider",
    description: "Create a theme provider using Context API",
    dueDate: "2024-02-15",
    status: "not-started",
    estimatedTime: "2 hours",
    maxScore: 100,
    fileCount: 0
  }
];