import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createQuiz, bulkUploadQuestions, updateQuiz } from '@/services/quizServices';

const QUIZ_TYPES = [
  { label: 'Final', value: 'FINAL' },
  { label: 'General', value: 'GENERAL' },
];

const QUESTION_TYPES = [
  { label: 'MCQ', value: 'MCQ' },
  { label: 'Matching', value: 'MATCHING' },
];

const QuizModal = ({ isOpen, onClose, moduleId, onQuizCreated, editingQuiz, onQuizUpdated, isAddingQuestions }) => {
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
      type: 'MCQ',
      correctAnswer: '',
      options: [{ text: '', isCorrect: false }],
      matchPairs: [{ text: '', matchWith: '' }],
    },
  ]);

  useEffect(() => {
    if (editingQuiz) {
      if (isAddingQuestions) {
        // If adding questions to existing quiz, go directly to step 2
        setStep(2);
        setCreatedQuiz(editingQuiz);
      } else {
        // If editing quiz details, populate form and stay on step 1
        setForm({
          title: editingQuiz.title || '',
          type: editingQuiz.type || 'FINAL',
          maxAttempts: editingQuiz.maxAttempts || 5,
          time_estimate: editingQuiz.time_estimate || 30,
          max_score: editingQuiz.max_score || 100,
          min_score: editingQuiz.min_score || 40,
        });
        setStep(1);
      }
    } else {
      // Reset form when not editing
      setForm({
        title: '',
        type: 'FINAL',
        maxAttempts: 5,
        time_estimate: 30,
        max_score: 100,
        min_score: 40,
      });
      setStep(1);
    }
  }, [editingQuiz, isAddingQuestions]);

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
      const quizData = {
        module_id: moduleId,
        ...form,
        maxAttempts: Number(form.maxAttempts),
        time_estimate: Number(form.time_estimate),
        max_score: Number(form.max_score),
        min_score: Number(form.min_score),
      };
      let created;
      if (editingQuiz) {
        // Many backends disallow changing module_id during update. Send only editable fields.
        const { module_id: _omitModuleId, ...updatableFields } = quizData;
        created = await updateQuiz(editingQuiz.id, updatableFields);
      } else {
        created = await createQuiz(quizData);
      }
      // Extract quiz id from possible response shapes
      let quizId = created?.data?.id || created?.data?._id || created?.id || created?._id;
      setCreatedQuiz({ ...created, id: quizId });
      if (editingQuiz) {
        if (onQuizUpdated) onQuizUpdated(created);
        onClose();
      } else {
        setStep(2);
        if (onQuizCreated) onQuizCreated(created);
      }
    } catch (err) {
      setError(editingQuiz ? 'Failed to update quiz. Please try again.' : 'Failed to create quiz. Please try again.');
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
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.map((opt, oi) => ({ ...opt, isCorrect: oi === optIdx })) } : q
    ));
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

  // Matching pairs
  const handleMatchPairChange = (qIdx, pairIdx, field, value) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, matchPairs: q.matchPairs.map((p, pi) => pi === pairIdx ? { ...p, [field]: value } : p) } : q
    ));
  };

  const handleAddMatchPair = (qIdx) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, matchPairs: [...q.matchPairs, { text: '', matchWith: '' }] } : q
    ));
  };

  const handleRemoveMatchPair = (qIdx, pairIdx) => {
    setQuestions((prev) => prev.map((q, i) =>
      i === qIdx ? { ...q, matchPairs: q.matchPairs.filter((_, pi) => pi !== pairIdx) } : q
    ));
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        type: 'MCQ',
        correctAnswer: '',
        options: [{ text: '', isCorrect: false }],
        matchPairs: [{ text: '', matchWith: '' }],
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
          if (q.type === 'MCQ') {
            const correct = q.options.find(opt => opt.isCorrect);
            return correct ? correct.text : '';
          } else {
            return '';
          }
        }),
        question_types: questions.map(q => q.type),
        question_options: questions.map(q =>
          q.type === 'MCQ'
            ? q.options
            : q.matchPairs
        ),
      };
      // Use the extracted quiz id
      const quizId = createdQuiz?.id || createdQuiz?.data?.id || createdQuiz?.data?._id;
      if (!quizId) throw new Error('Quiz ID not found.');
      await bulkUploadQuestions(quizId, payload);
      setStep(3);
      if (onQuizCreated) onQuizCreated();
    } catch (err) {
      setError('Failed to upload questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add questions UI
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4">
            {isAddingQuestions ? `Add Questions to "${editingQuiz?.title}"` : 'Add Questions'}
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
                  onChange={e => handleQuestionChange(qIdx, 'type', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {QUESTION_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {q.type === 'MCQ' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 mb-1">
                      <Input
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt.text}
                        onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                      />
                      <input
                        type="radio"
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectOption(qIdx, optIdx)}
                        name={`correct-${qIdx}`}
                      />
                      <span className="text-xs">Correct</span>
                      <Button size="sm" variant="outline" onClick={() => handleRemoveOption(qIdx, optIdx)} disabled={q.options.length === 1}>Remove</Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => handleAddOption(qIdx)}>Add Option</Button>
                </div>
              )}
              {q.type === 'MATCHING' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Pairs</label>
                  {q.matchPairs.map((pair, pairIdx) => (
                    <div key={pairIdx} className="flex items-center gap-2 mb-1">
                      <Input
                        placeholder="Text"
                        value={pair.text}
                        onChange={e => handleMatchPairChange(qIdx, pairIdx, 'text', e.target.value)}
                      />
                      <span className="text-xs">matches with</span>
                      <Input
                        placeholder="Match With"
                        value={pair.matchWith}
                        onChange={e => handleMatchPairChange(qIdx, pairIdx, 'matchWith', e.target.value)}
                      />
                      <Button size="sm" variant="outline" onClick={() => handleRemoveMatchPair(qIdx, pairIdx)} disabled={q.matchPairs.length === 1}>Remove</Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => handleAddMatchPair(qIdx)}>Add Pair</Button>
                </div>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={handleAddQuestion}>Add Another Question</Button>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose} variant="outline" disabled={loading}>Cancel</Button>
            <Button onClick={handleBulkUpload} loading={loading} disabled={loading}>
              {isAddingQuestions ? 'Add Questions' : 'Submit Questions'}
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
            {isAddingQuestions ? 'Questions Added!' : 'Quiz Created!'}
          </h2>
          <p className="mb-4 text-gray-600">
            {isAddingQuestions 
              ? `Questions have been successfully added to "${editingQuiz?.title}".`
              : 'Your quiz and questions have been successfully created.'
            }
          </p>
          <Button onClick={() => {
            if (onQuizCreated) onQuizCreated();
            onClose();
          }} variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  // Step 1: Quiz details
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h2>
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
          <Button onClick={onClose} variant="outline" disabled={loading}>Cancel</Button>
          <Button onClick={handleNext} loading={loading} disabled={loading || !form.title}>
            {editingQuiz ? 'Update Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;