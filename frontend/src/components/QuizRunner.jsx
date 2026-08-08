import React, { useState, useEffect } from 'react';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

export const QuizRunner = ({ quizId, onFinish }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [started, setStarted] = useState(false);

  const [answers, setAnswers] = useState({}); // { question_id: option_id }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/api/quizzes/${quizId}`);
        setQuiz(res.data);
        if (res.data.time_limit_minutes) {
          setTimeLeft(res.data.time_limit_minutes * 60);
        }
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Countdown timer
  useEffect(() => {
    if (!started || result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, result, timeLeft]);

  const handleOptionSelect = (questionId, optionId, isMultiple) => {
    if (result) return;
    setAnswers(prev => {
      if (isMultiple) {
        const current = prev[questionId] || [];
        const exists = current.includes(optionId);
        const updated = exists ? current.filter(id => id !== optionId) : [...current, optionId];
        return { ...prev, [questionId]: updated };
      } else {
        return { ...prev, [questionId]: optionId };
      }
    });
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/api/quizzes/${quizId}/submit`, {
        user_name: userName.trim() || 'Guest Student',
        answers
      });
      setResult(res.data);

      if (res.data.is_passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      if (onFinish) onFinish(res.data);
    } catch (err) {
      alert('Error submitting quiz: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Quiz...</div>;
  if (error || !quiz) return <div style={{ padding: '2rem', color: 'var(--error-color)' }}>{error || 'Quiz unavailable.'}</div>;

  // Screen 1: Start Screen
  if (!started) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(30, 58, 138, 0.1)',
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Award size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{quiz.title}</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>{quiz.description || 'Test your understanding with this interactive quiz.'}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          background: 'var(--gray-50)',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <div><strong>Questions:</strong> {quiz.question_count || quiz.questions?.length}</div>
          <div><strong>Time Limit:</strong> {quiz.time_limit_minutes} mins</div>
          <div><strong>Passing Score:</strong> {quiz.passing_score}%</div>
          <div><strong>Access:</strong> Free / Open</div>
        </div>

        <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label className="form-label">Your Name (Optional for score certificate)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Priya Sharma"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStarted(true)}>
          Start Assessment Now <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Screen 3: Results Evaluation Screen
  if (result) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: result.is_passed ? '#D1FAE5' : '#FEE2E2',
            color: result.is_passed ? '#065F46' : '#991B1B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            {result.is_passed ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {result.is_passed ? 'Congratulations! You Passed!' : 'Needs Revision'}
          </h2>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.3rem' }}>
            Score for <strong>{result.user_identifier}</strong>
          </p>
        </div>

        {/* Score Summary Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          background: 'var(--gray-50)',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Your Percentage</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: result.is_passed ? 'var(--success-color)' : 'var(--error-color)' }}>
              {result.percentage}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Score Earned</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {result.score} / {result.max_score}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Passing Mark</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {result.passing_score}%
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Detailed Answer Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {result.results.map((resItem, idx) => (
            <div
              key={resItem.question_id}
              style={{
                border: `1.5px solid ${resItem.is_correct ? '#10B981' : '#EF4444'}`,
                borderRadius: '10px',
                padding: '1.25rem',
                background: resItem.is_correct ? '#F0FDF4' : '#FEF2F2'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Question {idx + 1}</span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: resItem.is_correct ? '#065F46' : '#991B1B'
                }}>
                  {resItem.is_correct ? `+${resItem.points} Points` : '0 Points'}
                </span>
              </div>

              <p style={{ fontWeight: 600, color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                {resItem.question_text}
              </p>

              {resItem.explanation && (
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', background: 'rgba(255,255,255,0.7)', padding: '8px 12px', borderRadius: '6px', marginTop: '0.5rem' }}>
                  💡 <strong>Explanation:</strong> {resItem.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline"
          style={{ width: '100%' }}
          onClick={() => {
            setResult(null);
            setAnswers({});
            setStarted(false);
          }}
        >
          <RotateCcw size={16} /> Retake Assessment
        </button>
      </div>
    );
  }

  // Screen 2: Active Quiz Questions Screen
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      {/* Top Quiz Header & Live Timer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{quiz.title}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{quiz.questions?.length} Questions</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: timeLeft < 120 ? '#FEE2E2' : 'var(--gray-100)',
          color: timeLeft < 120 ? '#991B1B' : 'var(--text-color)',
          fontWeight: 700,
          fontSize: '1rem'
        }}>
          <Clock size={18} /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
        {quiz.questions?.map((q, idx) => {
          const isMultiple = q.question_type === 'multiple_choice';
          const currentAns = answers[q.id];

          return (
            <div key={q.id} style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  Q{idx + 1}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginLeft: 'auto' }}>
                  {q.points} Points
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-color)', marginBottom: '1rem' }}>
                {q.question_text}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {q.options?.map((opt) => {
                  const selected = isMultiple
                    ? Array.isArray(currentAns) && currentAns.includes(opt.id)
                    : currentAns === opt.id;

                  return (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: selected ? '2px solid var(--primary-color)' : '1px solid var(--gray-300)',
                        background: selected ? 'rgba(30, 58, 138, 0.05)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type={isMultiple ? 'checkbox' : 'radio'}
                        name={`question_${q.id}`}
                        checked={!!selected}
                        onChange={() => handleOptionSelect(q.id, opt.id, isMultiple)}
                        style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-color)' }}>{opt.option_text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="btn btn-primary btn-lg"
        style={{ width: '100%' }}
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Submitting Answers...' : 'Submit Assessment'}
      </button>
    </div>
  );
};
