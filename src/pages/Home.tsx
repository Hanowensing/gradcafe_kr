import { useState, useEffect, useMemo } from 'react';
import { Loader2, ThumbsUp, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AdmissionResult, SearchFilters } from '../types';
import FilterBar from '../components/FilterBar';
import DecisionBadge from '../components/DecisionBadge';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const defaultFilters: SearchFilters = {
  university: '', department: '', degree: '', decision: '', season: '',
};

function toResult(r: any): AdmissionResult {
  return {
    id: r.id,
    university: r.university,
    department: r.department,
    degree: r.degree,
    decision: r.decision,
    season: r.season,
    gpa: r.gpa ?? undefined,
    gpaMax: r.gpa_max ?? undefined,
    englishType: r.english_type ?? undefined,
    englishScore: r.english_score ?? undefined,
    researchExp: r.research_exp ?? undefined,
    note: r.note ?? undefined,
    createdAt: r.created_at,
    upvotes: r.upvotes,
    comments: [],
    commentCount: r.comment_count?.[0]?.count ?? 0,
  };
}

export default function Home() {
  const [results, setResults] = useState<AdmissionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<'latest' | 'upvotes'>('latest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('results')
      .select('*, comment_count:comments(count)')
      .order('created_at', { ascending: false });
    if (!error && data) setResults(data.map(toResult));
    setLoading(false);
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = results.find(r => r.id === id);
    if (!target) return;
    await supabase.from('results').update({ upvotes: target.upvotes + 1 }).eq('id', id);
    setResults(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  const filtered = useMemo(() => {
    return results
      .filter(r => {
        if (filters.university && r.university !== filters.university) return false;
        if (filters.department && r.department !== filters.department) return false;
        if (filters.degree && r.degree !== filters.degree) return false;
        if (filters.decision && r.decision !== filters.decision) return false;
        if (filters.season && r.season !== filters.season) return false;
        return true;
      })
      .sort((a, b) =>
        sortBy === 'upvotes'
          ? b.upvotes - a.upvotes
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [results, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 필터 */}
      <div className="mb-4">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* 정렬 & 카운트 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">
          {loading ? '' : `총 ${filtered.length}건`}
        </span>
        <div className="flex gap-2">
          {(['latest', 'upvotes'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                sortBy === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s === 'latest' ? '최신순' : '추천순'}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* 헤더 — 데스크톱만 표시 */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_80px_90px_100px_110px_80px] gap-x-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>학교 / 학과</span>
          <span>결과</span>
          <span>학점</span>
          <span>영어</span>
          <span>시즌</span>
          <span>등록일</span>
          <span className="text-right">반응</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-slate-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="font-medium mb-1">결과가 없습니다</p>
            <p className="text-sm">필터를 변경하거나 직접 등록해보세요</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(r => (
              <ResultRow
                key={r.id}
                result={r}
                expanded={expandedId === r.id}
                onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({
  result, expanded, onToggle, onUpvote,
}: {
  result: AdmissionResult;
  expanded: boolean;
  onToggle: () => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(result.createdAt), { addSuffix: true, locale: ko });

  return (
    <div>
      {/* 메인 행 */}
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_80px_90px_100px_110px_80px] gap-x-3 px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors items-center"
        onClick={onToggle}
      >
        {/* 학교 / 학과 */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm">{result.university}</span>
            {/* 모바일: 배지를 여기에 */}
            <span className="md:hidden">
              <DecisionBadge decision={result.decision} />
            </span>
          </div>
          <span className="text-xs text-slate-500">{result.department} · {result.degree}</span>
        </div>

        {/* 결과 — 데스크톱 */}
        <div className="hidden md:block">
          <DecisionBadge decision={result.decision} />
        </div>

        {/* 학점 */}
        <div className="hidden md:block text-sm text-slate-600">
          {result.gpa ? `${result.gpa}/${result.gpaMax ?? 4.5}` : <span className="text-slate-300">—</span>}
        </div>

        {/* 영어 */}
        <div className="hidden md:block text-sm text-slate-600">
          {result.englishScore
            ? <span>{result.englishType} {result.englishScore}</span>
            : <span className="text-slate-300">—</span>}
        </div>

        {/* 시즌 */}
        <div className="hidden md:block text-xs text-slate-500">{result.season}</div>

        {/* 등록일 */}
        <div className="hidden md:block text-xs text-slate-400">{timeAgo}</div>

        {/* 반응 */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          <button
            onClick={e => onUpvote(result.id, e)}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs"
          >
            <ThumbsUp size={13} />
            {result.upvotes}
          </button>
          <Link
            to={`/result/${result.id}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs"
          >
            <MessageCircle size={13} />
            {result.commentCount ?? 0}
          </Link>
          <span className="text-slate-300">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>

        {/* 모바일: 하단 메타 */}
        <div className="md:hidden flex items-center gap-3 mt-1.5 text-xs text-slate-400">
          <span>{result.season}</span>
          <span>{timeAgo}</span>
          <button onClick={e => onUpvote(result.id, e)} className="flex items-center gap-1 hover:text-blue-600">
            <ThumbsUp size={12} />{result.upvotes}
          </button>
          <Link to={`/result/${result.id}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 hover:text-blue-600">
            <MessageCircle size={12} />{result.commentCount ?? 0}
          </Link>
        </div>
      </div>

      {/* 펼쳐진 메모 */}
      {expanded && (
        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
          <div className="pt-3 flex flex-wrap gap-4 text-sm mb-3">
            {result.gpa && (
              <span className="text-slate-600">학점 <strong className="text-slate-800">{result.gpa}/{result.gpaMax ?? 4.5}</strong></span>
            )}
            {result.englishScore && (
              <span className="text-slate-600">{result.englishType} <strong className="text-slate-800">{result.englishScore}</strong></span>
            )}
            {result.researchExp !== undefined && (
              <span className="text-slate-600">연구경험 <strong className="text-slate-800">{result.researchExp ? '있음' : '없음'}</strong></span>
            )}
          </div>
          {result.note && (
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{result.note}</p>
          )}
          <Link
            to={`/result/${result.id}`}
            className="text-xs text-blue-600 hover:underline"
          >
            댓글 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}
