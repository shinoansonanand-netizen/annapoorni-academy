import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuizRunner } from '../../components/QuizRunner';
import { ArrowLeft } from 'lucide-react';

export const QuizView = () => {
  const { id } = useParams();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <QuizRunner quizId={id} />
    </div>
  );
};
