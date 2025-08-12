import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  ArrowLeft, 
  Plus, 
  FileText, 
  MessageSquare, 
  Quote, 
  List, 
  Image, 
  Settings, 
  Save,
  Eye,
  Search,
  Calendar,
  Bell,
  User,
  BookOpen,
  Home,
  Users,
  Folder,
  MessageCircle,
  Gamepad2,
  File,
  Settings as SettingsIcon,
  BarChart3,
  HelpCircle,
  X,
  GripVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import axios from 'axios';

// --- ADDED: Rich Text Editor ---
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register font sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['small', 'normal', 'large', 'huge'];
Quill.register(Size, true);

// Register font families
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'times-new-roman', 'courier-new', 'roboto', 'serif', 'sans-serif'];
Quill.register(Font, true);

// Font size whitelist for px values
const PxSize = Quill.import('formats/size');
PxSize.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
Quill.register(PxSize, true);

// Universal toolbar for paragraph/content (no header, px size)
const paragraphToolbar = [
  [{ 'font': Font.whitelist }],
  [{ 'size': PxSize.whitelist }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean']
];

// Simplified toolbar for heading/subheading (no header, px size, only essentials)
const headingToolbar = [
  [{ 'font': Font.whitelist }],
  [{ 'size': PxSize.whitelist }],
  ['bold', 'italic', 'underline'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['clean']
];

// --- END ADDED ---

const LessonBuilder = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blocks');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('New Lesson');
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [showTextTypeModal, setShowTextTypeModal] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [savedLesson, setSavedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);

  // --- UPDATED: Modal states for editing ---
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorHeading, setEditorHeading] = useState('');
  const [editorSubheading, setEditorSubheading] = useState('');
  // --- END UPDATED ---

  const blockRefs = React.useRef({});

  // Text type options for the modal
  const textTypeOptions = [
    {
      id: 'paragraph',
      title: 'Paragraph',
      description: 'Simple text paragraph',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      preview: 'This is a sample paragraph text that would appear in your lesson content.'
    },
    {
      id: 'heading-paragraph',
      title: 'Heading + Paragraph',
      description: 'Main heading with content',
      icon: <div className="h-6 w-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">H1</div>,
      preview: (
        <div>
          <div className="text-xl font-bold mb-2">Main Heading</div>
          <div>Content paragraph goes here.</div>
        </div>
      )
    },
    {
      id: 'subheading-paragraph',
      title: 'Subheading + Paragraph',
      description: 'Subheading with content',
      icon: <div className="h-6 w-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">H2</div>,
      preview: (
        <div>
          <div className="text-lg font-semibold mb-2">Subheading</div>
          <div>Content paragraph goes here.</div>
        </div>
      )
    }
  ];

  // Load lesson data when component mounts
  useEffect(() => {
    const loadLessonData = async () => {
      try {
        // Here you would typically fetch lesson data from your API
        // For now, we'll simulate loading lesson data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock lesson data - in real app, this would come from API
        const mockLessonData = {
          id: lessonId,
          title: `Lesson ${lessonId}`,
          description: 'Lesson description',
          contentBlocks: [],
          status: 'DRAFT'
        };
        
        setLessonData(mockLessonData);
        setLessonTitle(mockLessonData.title);
        setContentBlocks(mockLessonData.contentBlocks || []);
      } catch (error) {
        console.error('Error loading lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [lessonId]);

  // Fetch all lessons for the current course and module
  const fetchLessons = async () => {
    const apiUrl = `https://creditor-backend-testing-branch.onrender.com/api/course/${courseId}/modules/${moduleId}/lesson/all-lessons`;
    try {
      const response = await axios.get(apiUrl);
      console.log('LESSONS API RESPONSE:', response.data); // Debug: check structure
      setLessons(response.data.lessons || response.data); // Use correct property
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  // Fetch lessons on mount and after saving
  useEffect(() => {
    if (courseId && moduleId) {
      fetchLessons();
    }
  }, [courseId, moduleId]);

  // Content block types available in the sidebar
  const contentBlockTypes = [
    {
      id: 'text',
      title: 'Text',
      description: 'Paragraph, headings, tables',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'statement',
      title: 'Statement',
      description: 'Highlighted statements',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Inspiring quotes with layouts',
      icon: <Quote className="h-5 w-5" />
    },
    {
      id: 'list',
      title: 'List',
      description: 'Bullets, numbers, checklists',
      icon: <List className="h-5 w-5" />
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Image galleries and grids',
      icon: <Image className="h-5 w-5" />
    },
    {
      id: 'interactive',
      title: 'Interactive',
      description: 'Interactive components',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const handleBlockClick = (blockType) => {
    if (blockType.id === 'text') {
      setShowTextTypeModal(true);
    } else {
      addContentBlock(blockType);
    }
  };

  const addContentBlock = (blockType, textType = null) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType.id,
      title: blockType.title,
      textType: textType,
      content: '',
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const handleTextTypeSelect = (textType) => {
    addContentBlock({ id: 'text', title: 'Text' }, textType.id);
    setShowTextTypeModal(false);
  };

  const removeContentBlock = (blockId) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== blockId));
  };

  const updateBlockContent = (blockId, content, heading = null, subheading = null) => {
    setContentBlocks(blocks => 
      blocks.map(block => 
        block.id === blockId ? { 
          ...block, 
          content,
          ...(heading !== null && { heading }),
          ...(subheading !== null && { subheading })
        } : block
      )
    );
  };

  // --- UPDATED: Edit block handler for modal ---
  const handleEditBlock = (blockId) => {
    const block = contentBlocks.find(b => b.id === blockId);
    if (!block) return;
    setCurrentBlock(block);
    setEditorContent(block.content || '');
    setEditorHeading(block.heading || '');
    setEditorSubheading(block.subheading || '');
    setEditModalOpen(true);
  };

  const handleEditorSave = () => {
    if (!currentBlock) return;
    updateBlockContent(
      currentBlock.id,
      editorContent,
      currentBlock.textType === 'heading-paragraph' ? editorHeading : null,
      currentBlock.textType === 'subheading-paragraph' ? editorSubheading : null
    );
    setEditModalOpen(false);
    setCurrentBlock(null);
    setEditorContent('');
    setEditorHeading('');
    setEditorSubheading('');
  };
  // --- END UPDATED ---

  const handleDragStart = (e, blockId) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetBlockId) => {
    e.preventDefault();
    if (draggedBlockId === null || draggedBlockId === targetBlockId) return;
    const sourceIndex = contentBlocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = contentBlocks.findIndex(b => b.id === targetBlockId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    const updated = [...contentBlocks];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setContentBlocks(updated.map((b, i) => ({ ...b, order: i + 1 })));
    setDraggedBlockId(null);
  };

  const handleSave = async () => {
    // Prepare lesson data
    const lessonDataToSave = {
      title: lessonTitle,
      contentBlocks,
      status: 'DRAFT',
      lastModified: new Date().toISOString()
    };

    // Use dynamic courseId and moduleId from URL params
    const apiUrl = `https://creditor-backend-testing-branch.onrender.com/api/course/${courseId}/modules/${moduleId}/lesson/create-lesson`;

    try {
      const response = await axios.post(apiUrl, lessonDataToSave);
      setSavedLesson(response.data.lesson || response.data); // Adjust based on API response structure
      alert('Lesson saved as draft successfully!');
    } catch (error) {
      alert('Error saving lesson!');
      console.error(error);
    }
  };

  const handlePreview = () => {
    // Preview the lesson
    console.log('Previewing lesson:', { lessonTitle, contentBlocks });
    // Here you would typically open a preview modal or navigate to preview page
    alert('Preview functionality coming soon!');
  };

  const handleUpdate = () => {
    // Update the lesson
    const lessonDataToUpdate = {
      ...lessonData,
      title: lessonTitle,
      contentBlocks,
      status: 'PUBLISHED',
      lastModified: new Date().toISOString()
    };
    
    console.log('Updating lesson:', lessonDataToUpdate);
    // Here you would typically call your API to update the lesson
    
    // Show success message
    alert('Lesson updated successfully!');
  };

  const universalToolbar = [
    [{ 'font': Font.whitelist }],
    [{ 'size': Size.whitelist }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      {/* Main Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Content Blocks Sidebar */}
      <div 
        className="fixed top-0 h-screen z-20 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 overflow-y-auto w-80"
        style={{
          left: collapsed ? "4.5rem" : "17rem"
        }}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Content Blocks</h1>
          <p className="text-sm text-gray-600">Click blocks to add them to your lesson</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'blocks' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'templates' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'settings' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Content Blocks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {contentBlockTypes.map((blockType) => (
            <Card 
              key={blockType.id}
              className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => handleBlockClick(blockType)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {blockType.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">{blockType.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{blockType.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ 
          marginLeft: collapsed ? "calc(4.5rem + 20rem)" : "calc(17rem + 20rem)"
        }}
      >
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 transition-all duration-300"
          style={{ 
            marginLeft: collapsed ? "calc(4.5rem + 20rem)" : "calc(17rem + 20rem)"
          }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <DashboardHeader sidebarCollapsed={collapsed} />
          </div>
        </header>

        {/* Lesson Builder Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
                placeholder="Enter lesson title..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save as Draft
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview}>
                Preview
              </Button>
              <Button size="sm" onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Canvas */}
        <div className="flex-1 p-6 overflow-y-auto">
          {contentBlocks.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Building Your Lesson
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Choose content blocks from the sidebar to create engaging learning content.
                  </p>
                  <Button 
                    onClick={() => setShowTextTypeModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text Block
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <Card 
                  key={block.id} 
                  className="border border-gray-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, block.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {block.title}
                        </Badge>
                        <span className="text-sm text-gray-500">Block {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-move"
                          title="Drag to reorder"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBlock(block.id)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContentBlock(block.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {block.type && (
                      <div>
                        {block.textType === 'heading-paragraph' && (
                          <div className="space-y-3">
                            <div
                              className="prose"
                              dangerouslySetInnerHTML={{ __html: block.heading }}
                            />
                            <div
                              className="prose"
                              dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                          </div>
                        )}
                        {block.textType === 'subheading-paragraph' && (
                          <div className="space-y-3">
                            <div
                              className="prose"
                              dangerouslySetInnerHTML={{ __html: block.subheading }}
                            />
                            <div
                              className="prose"
                              dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                          </div>
                        )}
                        {block.textType === 'paragraph' && (
                          <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        )}
                        {(block.type === 'statement' || block.type === 'quote') && (
                          <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        )}
                        {block.type === 'list' && (
                          <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Lessons Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Lessons</h2>
          {lessons && lessons.length === 0 ? (
            <p>No lessons yet</p>
          ) : (
            lessons && lessons.map(lesson => (
              <div key={lesson._id || lesson.id} className="card">
                <h3>{lesson.title}</h3>
                {/* Render lesson details */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Text Type Selection Modal */}
      <Dialog open={showTextTypeModal} onOpenChange={setShowTextTypeModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Choose Text Type</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 mt-4">
            {textTypeOptions.map((option) => (
              <Card 
                key={option.id}
                className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                onClick={() => handleTextTypeSelect(option)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                        {option.preview}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- ADDED: Edit Block Modal --- */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {currentBlock?.title}
            </DialogTitle>
          </DialogHeader>
          {currentBlock && (
            <div className="space-y-4">
              {/* Heading + Paragraph */}
              {currentBlock.type === 'text' && currentBlock.textType === 'heading-paragraph' && (
                <>
                  <label className="block font-medium mb-2">Heading</label>
                  <div style={{ height: '120px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorHeading}
                      onChange={setEditorHeading}
                      theme="snow"
                      modules={{ toolbar: headingToolbar }}
                      placeholder="Type and format your heading here"
                      style={{ height: '80px' }}
                    />
                  </div>
                  <label className="block font-medium mb-2 mt-4">Paragraph</label>
                  <div style={{ height: '230px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      theme="snow"
                      modules={{ toolbar: paragraphToolbar }}
                      placeholder="Type and format your content here"
                      style={{ height: '180px' }}
                    />
                  </div>
                </>
              )}

              {/* Subheading + Paragraph */}
              {currentBlock.type === 'text' && currentBlock.textType === 'subheading-paragraph' && (
                <>
                  <label className="block font-medium mb-2">Subheading</label>
                  <div style={{ height: '120px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorSubheading}
                      onChange={setEditorSubheading}
                      theme="snow"
                      modules={{ toolbar: headingToolbar }}
                      placeholder="Type and format your subheading here"
                      style={{ height: '80px' }}
                    />
                  </div>
                  <label className="block font-medium mb-2 mt-4">Paragraph</label>
                  <div style={{ height: '230px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      theme="snow"
                      modules={{ toolbar: paragraphToolbar }}
                      placeholder="Type and format your content here"
                      style={{ height: '180px' }}
                    />
                  </div>
                </>
              )}

              {/* Paragraph only */}
              {currentBlock.type === 'text' && currentBlock.textType === 'paragraph' && (
                <>
                  <label className="block font-medium mb-2">Paragraph</label>
                  <div style={{ height: '350px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      theme="snow"
                      modules={{ toolbar: paragraphToolbar }}
                      placeholder="Type and format your content here"
                      style={{ height: '300px' }}
                    />
                  </div>
                </>
              )}

              {/* Other block types */}
              {(currentBlock.type === 'statement' || currentBlock.type === 'quote') && (
                <>
                  <label className="block font-medium mb-2">{currentBlock.type === 'statement' ? 'Statement' : 'Quote'}</label>
                  <div style={{ height: '350px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      theme="snow"
                      modules={{ toolbar: paragraphToolbar }}
                      placeholder={`Type and format your ${currentBlock.type} here`}
                      style={{ height: '300px' }}
                    />
                  </div>
                </>
              )}

              {/* List block type */}
              {currentBlock.type === 'list' && (
                <>
                  <label className="block font-medium mb-2">List Items</label>
                  <div style={{ height: '350px', overflowY: 'auto' }}>
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      theme="snow"
                      modules={{ toolbar: paragraphToolbar }}
                      placeholder="Type and format your list here"
                      style={{ height: '300px' }}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleEditorSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* --- END ADDED --- */}
    </div>
  );
};

export default LessonBuilder;