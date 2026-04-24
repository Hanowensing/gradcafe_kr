import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, BookOpen, FlaskConical, Send, Loader2 } from 'lucide-react';
import DecisionBadge from '../components/DecisionBadge';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { AdmissionResult, Comment } from '../types';
import { supabase } from '../lib/supabase';

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AdmissionResult | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchResult();
    fetchComments();
  }, [id]);

  const fetchResult = async () => {
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      setResult({
        id: data.id,
        university: data.university,
        department: data.department,
        degree: data.degree,
        decision: data.decision,
        season: data.season,
        gpa: data.gpa ?? undefined,
        gpaMax: data.gpa_max ?? undefined,
        englishType: data.english_type ?? undefined,
        englishScore: data.english_score ?? undefined,
        researchExp: data.research_exp ?? undefined,
        note: data.note ?? undefined,
        createdAt: data.created_at,
        upvotes: data.upvotes,
        comments: [],
      });
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('result_id', id)
      .order('created_at', { ascending: true });
    if (data) {
      setComments(data.map(c => ({
        id: c.id,
        author: '익명',
        body: c.body,
        createdAt: c.created_at,
      })));
    }
  };

  const handleUpvote = async () => {
    if (!result) return;
    await supabase
      .from('results')
      .update({ upvotes: result.upvotes + 1 })
      .eq('id', result.id);
    setResult(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : prev);
  };

  const handleComment = async () => {
    if (!commentText.trim() || !id) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('comments')
      .insert({ result_id: id, body: commentText.trim() })
      .select()
      .single();
    if (data) {
      setComments(prev => [...prev, {
        id: data.id,
        author: '익명',
        body: data.body,
        createdAt: data.created_at,
      }]);
    }
    setCommentText('');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">
        <p className="text-xl font-medium">게시물을 찾을 수 없습니다</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm">← 목록으로</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <DecisionBadge decision={result.decision} />
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{result.degree}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{result.season}</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{result.university}</h1>
        <p className="text-slate-500 text-base mb-6">{result.department}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {result.gpa && (
            <SpecItem icon={<BookOpen size={16} />} label="학점" value={`${result.gpa} / ${result.gpaMax ?? 4.5}`} />
          )}
          {result.englishScore && (
            <SpecItem icon={<span className="text-xs font-bold">{result.englishType}</span>} label="영어 점수" value={String(result.englishScore)} />
          )}
          {result.researchExp !== undefined && (
            <SpecItem icon={<FlaskConical size={16} />} label="연구 경험" value={result.researchExp ? '있음' : '없음'} />
          )}
        </div>

        {result.note && (
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-700 leading-relaxed">{result.note}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-100 pt-4">
          <span>{format(new Date(result.createdAt), 'yyyy년 M월 d일', { locale: ko })}</span>
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp size={16} />
            도움됐어요 {result.upvotes}
          </button>
        </div>
      </div>

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
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
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
