import { useState, useMemo } from 'react';
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import { mockResults } from '../data/mockData';
import type { AdmissionResult, SearchFilters } from '../types';
import ResultCard from '../components/ResultCard';
import FilterBar from '../components/FilterBar';

const defaultFilters: SearchFilters = {
  university: '', department: '', degree: '', decision: '', season: '',
};

export default function Home() {
  const [results, setResults] = useState<AdmissionResult[]>(mockResults);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<'latest' | 'upvotes'>('latest');

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
      .sort((a, b) => {
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [results, filters, sortBy]);

  const stats = useMemo(() => ({
    total: results.length,
    accepted: results.filter(r => r.decision === '합격').length,
    rejected: results.filter(r => r.decision === '불합격').length,
    waiting: results.filter(r => r.decision === '대기').length,
  }), [results]);

  const handleUpvote = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          대학원 입시 결과 공유
        </h1>
        <p className="text-slate-500 text-lg">
          선배들의 합격·불합격 경험을 참고하고, 나의 결과도 공유해보세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users size={20} />} label="전체 등록" value={stats.total} color="blue" />
        <StatCard icon={<CheckCircle size={20} />} label="합격" value={stats.accepted} color="green" />
        <StatCard icon={<XCircle size={20} />} label="불합격" value={stats.rejected} color="red" />
        <StatCard icon={<TrendingUp size={20} />} label="대기·인터뷰" value={stats.waiting} color="yellow" />
      </div>

      {/* 필터 */}
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* 정렬 & 결과 수 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          {filtered.length}개의 결과
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${sortBy === 'latest' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('upvotes')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${sortBy === 'upvotes' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            추천순
          </button>
        </div>
      </div>

      {/* 결과 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl font-medium mb-2">결과가 없습니다</p>
          <p className="text-sm">필터를 변경하거나 직접 등록해보세요</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(r => (
            <ResultCard key={r.id} result={r} onUpvote={handleUpvote} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'red' | 'yellow';
}) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
