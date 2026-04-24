import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ThumbsUp, BookOpen, FlaskConical, Send } from 'lucide-react';
import { mockResults } from '../data/mockData';
import DecisionBadge from '../components/DecisionBadge';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Comment } from '../types';

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const result = mockResults.find(r => r.id === id);
  const [comments, setComments] = useState<Comment[]>(result?.comments ?? []);
  const [commentText, setCommentText] = useState('');
  const [upvotes, setUpvotes] = useState(result?.upvotes ?? 0);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">
        <p className="text-xl font-medium">게시물을 찾을 수 없습니다</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm">← 목록으로</Link>
      </div>
    );
  }

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: '익명',
      body: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        {/* 헤더 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <DecisionBadge decision={result.decision} />
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{result.degree}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{result.season}</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
          {result.university}
        </h1>
        <p className="text-slate-500 text-base mb-6">{result.department}</p>

        {/* 스펙 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {result.gpa && (
            <SpecItem
              icon={<BookOpen size={16} />}
              label="학점"
              value={`${result.gpa} / ${result.gpaMax ?? 4.5}`}
            />
          )}
          {result.englishScore && (
            <SpecItem
              icon={<span className="text-xs font-bold">{result.englishType}</span>}
              label="영어 점수"
              value={String(result.englishScore)}
            />
          )}
          {result.researchExp !== undefined && (
            <SpecItem
              icon={<FlaskConical size={16} />}
              label="연구 경험"
              value={result.researchExp ? '있음' : '없음'}
            />
          )}
        </div>

        {/* 메모 */}
        {result.note && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-700 leading-relaxed">{result.note}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-100 pt-4">
          <span>{format(new Date(result.createdAt), 'yyyy년 M월 d일', { locale: ko })}</span>
          <button
            onClick={() => setUpvotes(v => v + 1)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp size={16} />
            도움됐어요 {upvotes}
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">댓글 {comments.length}개</h2>

        <div className="space-y-3 mb-6">
          {comments.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">첫 번째 댓글을 남겨보세요</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{c.author}</span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: ko })}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            placeholder="댓글을 입력하세요 (익명)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <Send size={15} />
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-semibold text-slate-800 text-sm">{value}</p>
    </div>
  );
}
