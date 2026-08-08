import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Plus, Edit2, Trash2, HelpCircle, CheckSquare } from 'lucide-react';

export const QuizzesManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', course_id: '', time_limit_minutes: 15, passing_score: 70, is_published: true,
    questions: [
      { question_text: '', question_type: 'single_choice', points: 10, explanation: '', options: [{ option_text: 'Option A', is_correct: true }, { option_text: 'Option B', is_correct: false }] }
    ]
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [qRes, cRes] = await Promise.all([
        API.get('/api/admin/quizzes'),
        API.get('/api/admin/courses')
      ]);
      setQuizzes(qRes.data || []);
      setCourses(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingQuiz(null);
    setFormData({
      title: '', description: '', course_id: courses[0]?.id || '', time_limit_minutes: 15, passing_score: 70, is_published: true,
      questions: [
        { question_text: '', question_type: 'single_choice', points: 10, explanation: '', options: [{ option_text: 'Option A', is_correct: true }, { option_text: 'Option B', is_correct: false }] }
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuiz(q);
    setFormData({ ...q, course_id: q.course_id || '' });
    setModalOpen(true);
  };

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question_text: '', question_type: 'single_choice', points: 10, explanation: '', options: [{ option_text: 'Option A', is_correct: true }, { option_text: 'Option B', is_correct: false }] }
      ]
    }));
  };

  const handleQuestionChange = (qIdx, field, val) => {
    const updated = [...formData.questions];
    updated[qIdx][field] = val;
    setFormData({ ...formData, questions: updated });
  };

  const handleAddOption = (qIdx) => {
    const updated = [...formData.questions];
    updated[qIdx].options.push({ option_text: `Option ${updated[qIdx].options.length + 1}`, is_correct: false });
    setFormData({ ...formData, questions: updated });
  };

  const handleOptionChange = (qIdx, optIdx, field, val) => {
    const updated = [...formData.questions];
    if (field === 'is_correct' && updated[qIdx].question_type !== 'multiple_choice') {
      // Uncheck other options if single choice
      updated[qIdx].options.forEach((o, i) => o.is_correct = i === optIdx ? val : false);
    } else {
      updated[qIdx].options[optIdx][field] = val;
    }
    setFormData({ ...formData, questions: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await API.put(`/api/admin/quizzes/${editingQuiz.id}`, formData);
        setToastMsg('Quiz updated successfully!');
      } else {
        await API.post('/api/admin/quizzes', formData);
        setToastMsg('New quiz published!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save quiz');
    }
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);
    try {
      await API.delete(`/api/admin/quizzes/${quizToDelete.id}`);
      setToastMsg('Quiz deleted.');
      setDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to delete quiz');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading Quiz Builder...</div>;

  return (
    <div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quiz & Assessment Builder</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Create interactive quizzes, set correct options, points, time limits, and explanations.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Build New Quiz
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Course</th>
              <th>Questions</th>
              <th>Time Limit</th>
              <th>Passing Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(q => (
              <tr key={q.id}>
                <td style={{ fontWeight: 700 }}>{q.title}</td>
                <td>{q.course_title || 'General'}</td>
                <td>{q.question_count || q.questions?.length} Questions</td>
                <td>{q.time_limit_minutes} mins</td>
                <td>{q.passing_score}%</td>
                <td>
                  <span className={`badge ${q.is_published ? 'badge-published' : 'badge-draft'}`}>
                    {q.is_published ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(q)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#EF4444' }} onClick={() => { setQuizToDelete(q); setDeleteModalOpen(true); }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingQuiz ? 'Edit Quiz Assessment' : 'Build New Quiz Assessment'}
              </h3>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Quiz Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Python Essentials Quiz"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Course</label>
                  <select
                    className="form-control"
                    value={formData.course_id || ''}
                    onChange={e => setFormData({ ...formData, course_id: e.target.value })}
                  >
                    <option value="">No Course (General)</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.time_limit_minutes}
                      onChange={e => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) || 15 })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passing Score (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.passing_score}
                      onChange={e => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                    />
                  </div>
                </div>

                {/* Questions Builder */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Questions ({formData.questions.length})</h4>
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddQuestion}>
                      <Plus size={14} /> Add Question
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {formData.questions.map((q, qIdx) => (
                      <div key={qIdx} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder={`Question #${qIdx + 1} text...`}
                            value={q.question_text}
                            onChange={e => handleQuestionChange(qIdx, 'question_text', e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <select
                            className="form-control"
                            value={q.question_type}
                            onChange={e => handleQuestionChange(qIdx, 'question_type', e.target.value)}
                            style={{ width: '160px' }}
                          >
                            <option value="single_choice">Single Choice</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True / False</option>
                          </select>
                        </div>

                        {/* Options */}
                        <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Options & Correct Answer Check:</div>
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <input
                                type={q.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                                name={`q_${qIdx}_correct`}
                                checked={opt.is_correct}
                                onChange={e => handleOptionChange(qIdx, optIdx, 'is_correct', e.target.checked)}
                              />
                              <input
                                type="text"
                                className="form-control"
                                value={opt.option_text}
                                onChange={e => handleOptionChange(qIdx, optIdx, 'option_text', e.target.value)}
                                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                              />
                            </div>
                          ))}
                          <button type="button" className="btn btn-outline btn-sm" style={{ width: 'fit-content', marginTop: '4px' }} onClick={() => handleAddOption(qIdx)}>
                            + Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Quiz"
        message={`Are you sure you want to delete '${quizToDelete?.title}'?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};
