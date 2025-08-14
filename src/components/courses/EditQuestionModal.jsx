import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateQuestion } from '@/services/quizServices';
import { toast } from 'sonner';
import { X, Plus, Minus } from 'lucide-react';

const EditQuestionModal = ({ isOpen, onClose, question, quizId, onQuestionUpdated }) => {
  const [form, setForm] = useState({
    text: '',
    correct_answer: '',
    question_type: 'MCQ',
    question_options: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question && isOpen) {
      // Transform the question data to match the API format
      const options = question.question_options || question.options || [];
      const correctOption = options.find(opt => opt.isCorrect) || options[0];
      
      setForm({
        text: question.question || question.text || '',
        correct_answer: correctOption?.text || '',
        question_type: question.question_type || 'MCQ',
        question_options: options.map(opt => ({
          text: opt.text || opt,
          isCorrect: opt.isCorrect || false
        }))
      });
    }
  }, [question, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!form.text.trim()) {
        throw new Error('Question text is required');
      }
      if (form.question_type === 'MCQ' && form.question_options.length < 2) {
        throw new Error('At least 2 options are required');
      }
      if (!form.correct_answer.trim()) {
        throw new Error('Correct answer is required');
      }

      // Update the correct answer in options
      const updatedOptions = form.question_options.map(opt => ({
        ...opt,
        isCorrect: opt.text === form.correct_answer
      }));

      const questionData = {
        text: form.text,
        correct_answer: form.correct_answer,
        question_type: form.question_type,
        question_options: updatedOptions
      };

      await updateQuestion(quizId, question.id, questionData);
      toast.success('Question updated successfully!');
      if (onQuestionUpdated) {
        onQuestionUpdated();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update question');
      toast.error(err.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    setForm(prev => ({
      ...prev,
      question_options: prev.question_options.map((opt, i) => 
        i === index ? { ...opt, text: value } : opt
      )
    }));
  };

  const handleCorrectAnswerChange = (value) => {
    setForm(prev => ({
      ...prev,
      correct_answer: value
    }));
  };

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      question_options: [...prev.question_options, { text: '', isCorrect: false }]
    }));
  };

  const removeOption = (index) => {
    if (form.question_options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    
    setForm(prev => ({
      ...prev,
      question_options: prev.question_options.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Question</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <Input
              value={form.text}
              onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter question text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type
            </label>
            <select
              value={form.question_type}
              onChange={(e) => setForm(prev => ({ ...prev, question_type: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="MATCHING">Matching</option>
            </select>
          </div>

          {form.question_type === 'MCQ' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                {form.question_options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name="correct"
                      checked={option.text === form.correct_answer}
                      onChange={() => handleCorrectAnswerChange(option.text)}
                    />
                    <span className="text-xs text-gray-600">Correct</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={form.question_options.length <= 2}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <Input
                  value={form.correct_answer}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  placeholder="Enter correct answer"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={onClose} variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
