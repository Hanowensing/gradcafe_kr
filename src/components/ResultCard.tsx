import { ThumbsUp, MessageCircle, BookOpen, FlaskConical } from 'lucide-react';
import type { AdmissionResult } from '../types';
import DecisionBadge from './DecisionBadge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface Props {
  result: AdmissionResult;
  onUpvote: (id: string) => void;
}

export default function ResultCard({ result, onUpvote }: Props) {
  const timeAgo = formatDistanceToNow(new Date(result.createdAt), { addSuffix: true, locale: ko });

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <DecisionBadge decision={result.decision} />
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{result.degree}</span>
            <span className="text-xs text-slate-400">{result.season}</span>
          </div>

          <Link to={`/result/${result.id}`}>
            <h3 className="font-bold text-slate-900 text-lg hover:text-blue-700 transition-colors leading-tight">
              {result.university} · {result.department}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
            {result.gpa && (
              <span className="flex items-center gap-1">
                <BookOpen size={13} />
                학점 {result.gpa}/{result.gpaMax ?? 4.5}
              </span>
            )}
            {result.englishScore && (
              <span className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-400">{result.englishType}</span>
                {result.englishScore}
              </span>
            )}
            {result.researchExp !== undefined && (
              <span className="flex items-center gap-1">
                <FlaskConical size={13} />
                연구경험 {result.researchExp ? '있음' : '없음'}
              </span>
            )}
          </div>

          {result.note && (
            <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">{result.note}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{timeAgo}</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpvote(result.id)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-sm"
          >
            <ThumbsUp size={15} />
            <span>{result.upvotes}</span>
          </button>
          <Link
            to={`/result/${result.id}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-sm"
          >
            <MessageCircle size={15} />
            <span>{result.commentCount ?? result.comments.length}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
