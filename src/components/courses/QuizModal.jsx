import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createQuiz, bulkUploadQuestions, updateQuiz } from '@/services/quizServices';

const QUIZ_TYPES = [
  { label: 'Final', value: 'FINAL' },
  { label: 'General', value: 'GENERAL' },
];

const QUESTION_TYPES = [
  { label: 'MCQ - Single Correct', value: 'MCQ_SINGLE' },
  { label: 'MCQ - Multiple Correct', value: 'MCQ_MULTIPLE' },
  { label: 'True/False', value: 'TRUE_FALSE' },
  { label: 'Fill in the Blanks', value: 'FILL_UPS' },
  { label: 'One Word Answer', value: 'ONE_WORD' },
];

const QuizModal = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  onQuizCreated, 
  editingQuiz = null, 
  onQuizUpdated = null,
  isAddingQuestions = false 
}) => {
  const [form, setForm] = useState({
    title: '',
    type: 'FINAL',
    maxAttempts: 5,
    time_estimate: 30,
    max_score: 100,
    min_score: 40,
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdQuiz, setCreatedQuiz] = useState(null);

  // Question state for step 2
  const [questions, setQuestions] = useState([
    {
      text: '',
      type: 'MCQ_SINGLE',
      correctAnswer: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
    },
  ]);

  // Reset state when modal opens/closes or when editing quiz changes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setForm({
        title: '',
        type: 'FINAL',
        maxAttempts: 5,
        time_estimate: 30,
        max_score: 100,
        min_score: 40,
      });
      setStep(1);
      setLoading(false);
      setError('');
      setCreatedQuiz(null);
      setQuestions([
        {
          text: '',
          type: 'MCQ_SINGLE',
          correctAnswer: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
        },
      ]);
    } else if (editingQuiz && !isAddingQuestions) {
      // If editing an existing quiz, populate the form
      setForm({
        title: editingQuiz.title || '',
        type: editingQuiz.type || 'FINAL',
        maxAttempts: editingQuiz.maxAttempts || 5,
        time_estimate: editingQuiz.time_estimate || 30,
        max_score: editingQuiz.max_score || 100,
        min_score: editingQuiz.min_score || 40,
      });
      setCreatedQuiz(editingQuiz);
    } else if (editingQuiz && isAddingQuestions) {
      // If adding questions to existing quiz, set the quiz and go to step 2
      setCreatedQuiz(editingQuiz);
      setStep(2);
    }
  }, [isOpen, editingQuiz, isAddingQuestions]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');
    try {
      if (editingQuiz && !isAddingQuestions) {
        // Update existing quiz
        const quizData = {
          module_id: moduleId,
          ...form,
          maxAttempts: Number(form.maxAttempts),
          time_estimate: Number(form.time_estimate),
          max_score: Number(form.max_score),
          min_score: Number(form.min_score),
        };
        const updated = await updateQuiz(editingQuiz.id, quizData);
        setCreatedQuiz({ ...updated, id: editingQuiz.id });
        setStep(2);
        if (onQuizUpdated) onQuizUpdated(updated);
      } else {
        // Create new quiz
        const quizData = {
          module_id: moduleId,
          ...form,
          maxAttempts: Number(form.maxAttempts),
          time_estimate: Number(form.time_estimate),
          max_score: Number(form.max_score),
          min_score: Number(form.min_score),
        };
        const created = await createQuiz(quizData);
        // Extract quiz id from possible response shapes
        let quizId = created?.data?.id || created?.data?._id || created?.id || created?._id;
        setCreatedQuiz({ ...created, id: quizId });
        setStep(2);
        if (onQuizCreated) onQuizCreated(created);
      }
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Question handlers
  const handleQuestionChange = (idx, field, value) => {
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.map((opt, oi) => oi === optIdx ? { ...opt, text: value } : opt) } : q
    ));
  };

  const handleCorrectOption = (qIdx, optIdx) => {
    const question = questions[qIdx];
    if (question.type === 'MCQ_SINGLE' || question.type === 'TRUE_FALSE') {
      // For single correct and true/false, only one option can be correct
      setQuestions((prev) => prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((opt, oi) => ({ ...opt, isCorrect: oi === optIdx })) } : q
      ));
    } else if (question.type === 'MCQ_MULTIPLE') {
      // For multiple correct, toggle the selected option
      setQuestions((prev) => prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((opt, oi) => 
          oi === optIdx ? { ...opt, isCorrect: !opt.isCorrect } : opt
        )} : q
      ));
    }
  };

  const handleAddOption = (qIdx) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, options: [...q.options, { text: '', isCorrect: false }] } : q
    ));
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) } : q
    ));
  };

  // Ensure MCQ questions always have at least 2 options
  const ensureMinimumOptions = (qIdx) => {
    const question = questions[qIdx];
    if ((question.type === 'MCQ_SINGLE' || question.type === 'MCQ_MULTIPLE') && question.options.length < 2) {
      setQuestions((prev) => prev.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, { text: '', isCorrect: false }] } : q
      ));
    }
  };

  // Handle question type change and reset options accordingly
  const handleQuestionTypeChange = (qIdx, newType) => {
    let newOptions = [];
    if (newType === 'MCQ_SINGLE' || newType === 'MCQ_MULTIPLE') {
      newOptions = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ];
    } else if (newType === 'TRUE_FALSE') {
      newOptions = [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false }
      ];
    } else if (newType === 'FILL_UPS' || newType === 'ONE_WORD') {
      newOptions = [];
    }
    
    setQuestions((prev) => prev.map((q, i) => 
      i === qIdx ? { ...q, type: newType, options: newOptions, correctAnswer: '' } : q
    ));
  };



  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        type: 'MCQ_SINGLE',
        correctAnswer: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        texts: questions.map(q => q.text),
        correctAnswers: questions.map(q => {
          if (q.type === 'MCQ_SINGLE') {
            const correct = q.options.find(opt => opt.isCorrect);
            return correct ? correct.text : '';
          } else if (q.type === 'MCQ_MULTIPLE') {
            // For multiple correct, join all correct answers with comma
            const correctOptions = q.options.filter(opt => opt.isCorrect).map(opt => opt.text);
            return correctOptions.join(', ');
          } else if (q.type === 'TRUE_FALSE') {
            const correct = q.options.find(opt => opt.isCorrect);
            return correct ? correct.text : '';
          } else if (q.type === 'FILL_UPS' || q.type === 'ONE_WORD') {
            return q.correctAnswer;
          }
          return '';
        }),
        question_types: questions.map(q => q.type),
        question_options: questions.map(q => {
          if (q.type === 'MCQ_SINGLE' || q.type === 'MCQ_MULTIPLE' || q.type === 'TRUE_FALSE') {
            return q.options;
          }
          return [];
        }),
      };
      
      // Validate that all questions have required data
      const validationErrors = [];
      questions.forEach((q, index) => {
        if (!q.text.trim()) {
          validationErrors.push(`Question ${index + 1} is missing text`);
        }
        
        if (q.type === 'MCQ_SINGLE' || q.type === 'MCQ_MULTIPLE') {
          if (q.options.length < 2) {
            validationErrors.push(`Question ${index + 1} needs at least 2 options`);
          }
          const correctOptions = q.options.filter(opt => opt.isCorrect);
          if (correctOptions.length === 0) {
            validationErrors.push(`Question ${index + 1} needs at least one correct answer`);
          }
          if (q.type === 'MCQ_SINGLE' && correctOptions.length > 1) {
            validationErrors.push(`Question ${index + 1} can only have one correct answer`);
          }
        } else if (q.type === 'TRUE_FALSE') {
          const correctOptions = q.options.filter(opt => opt.isCorrect);
          if (correctOptions.length !== 1) {
            validationErrors.push(`Question ${index + 1} must have exactly one correct answer`);
          }
        } else if (q.type === 'FILL_UPS' || q.type === 'ONE_WORD') {
          if (!q.correctAnswer.trim()) {
            validationErrors.push(`Question ${index + 1} is missing correct answer`);
          }
        }
      });
      
      if (validationErrors.length > 0) {
        setError(`Validation errors: ${validationErrors.join(', ')}`);
        return;
      }
      
      // Use the extracted quiz id
      const quizId = createdQuiz?.id || createdQuiz?.data?.id || createdQuiz?.data?._id;
      if (!quizId) throw new Error('Quiz ID not found.');
      
      await bulkUploadQuestions(quizId, payload);
      setStep(3);
      if (onQuizCreated) onQuizCreated();
      if (onQuizUpdated) onQuizUpdated();
    } catch (err) {
      console.error('Bulk upload error:', err);
      setError(`Failed to upload questions: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Step 2: Add questions UI
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4">
            {isAddingQuestions ? 'Add Questions to Quiz' : 'Add Questions'}
          </h2>
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="mb-6 border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Question {qIdx + 1}</span>
                <Button size="sm" variant="outline" onClick={() => handleRemoveQuestion(qIdx)} disabled={questions.length === 1}>Remove</Button>
              </div>
              <Input
                className="mb-2"
                placeholder="Question text"
                value={q.text}
                onChange={e => handleQuestionChange(qIdx, 'text', e.target.value)}
              />
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={q.type}
                  onChange={e => handleQuestionTypeChange(qIdx, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {QUESTION_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {(q.type === 'MCQ_SINGLE' || q.type === 'MCQ_MULTIPLE') && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {q.type === 'MCQ_SINGLE' ? 'Options (Single Correct)' : 'Options (Multiple Correct)'}
                  </label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 mb-1">
                      <Input
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt.text}
                        onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                      />
                      {q.type === 'MCQ_SINGLE' ? (
                        <input
                          type="radio"
                          checked={opt.isCorrect}
                          onChange={() => handleCorrectOption(qIdx, optIdx)}
                          name={`correct-${qIdx}`}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={() => handleCorrectOption(qIdx, optIdx)}
                        />
                      )}
                      <span className="text-xs">
                        {q.type === 'MCQ_SINGLE' ? 'Correct' : 'Correct'}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleRemoveOption(qIdx, optIdx)} disabled={q.options.length === 1}>Remove</Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => handleAddOption(qIdx)}>Add Option</Button>
                </div>
              )}
              {q.type === 'TRUE_FALSE' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">True/False Options</label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 mb-1">
                      <span className="w-16 text-sm font-medium">{opt.text}</span>
                      <input
                        type="radio"
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectOption(qIdx, optIdx)}
                        name={`correct-${qIdx}`}
                      />
                      <span className="text-xs">Correct</span>
                    </div>
                  ))}
                </div>
              )}
              {(q.type === 'FILL_UPS' || q.type === 'ONE_WORD') && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <Input
                    placeholder={q.type === 'FILL_UPS' ? 'Enter the correct answer' : 'Enter the one word answer'}
                    value={q.correctAnswer}
                    onChange={e => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={handleAddQuestion}>Add Another Question</Button>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={handleClose} variant="outline" disabled={loading}>Cancel</Button>
            <Button onClick={handleBulkUpload} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Questions'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingQuiz ? 'Quiz Updated!' : 'Quiz Created!'}
          </h2>
          <p className="mb-4 text-gray-600">
            {editingQuiz 
              ? 'Your quiz has been successfully updated with new questions.'
              : 'Your quiz and questions have been successfully created.'
            }
          </p>
          <Button onClick={handleClose} variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  // Step 1: Quiz details
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module ID</label>
            <Input value={moduleId} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input name="title" value={form.title} onChange={handleChange} placeholder="Quiz Title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleTypeChange} className="w-full border rounded px-3 py-2">
              {QUIZ_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
              <Input name="maxAttempts" type="number" value={form.maxAttempts} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Estimate (min)</label>
              <Input name="time_estimate" type="number" value={form.time_estimate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
              <Input name="max_score" type="number" value={form.max_score} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
              <Input name="min_score" type="number" value={form.min_score} onChange={handleChange} />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={handleClose} variant="outline" disabled={loading}>Cancel</Button>
          <Button onClick={handleNext} disabled={loading || !form.title}>
            {loading ? 'Processing...' : (editingQuiz ? 'Update Quiz' : 'Next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;