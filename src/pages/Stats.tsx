import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UnivStat {
  university: string;
  합격: number;
  불합격: number;
  대기: number;
  인터뷰: number;
  total: number;
  rate: number;
}

export default function Stats() {
  const [stats, setStats] = useState<UnivStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<'total' | 'rate' | '합격'>('total');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('results')
      .select('university, decision');

    if (error || !data) { setLoading(false); return; }

    const map: Record<string, UnivStat> = {};
    for (const row of data) {
      if (!map[row.university]) {
        map[row.university] = { university: row.university, 합격: 0, 불합격: 0, 대기: 0, 인터뷰: 0, total: 0, rate: 0 };
      }
      map[row.university][row.decision as '합격' | '불합격' | '대기' | '인터뷰']++;
      map[row.university].total++;
    }

    const list = Object.values(map).map(s => ({
      ...s,
      rate: s.total > 0 ? Math.round((s.합격 / s.total) * 100) : 0,
    }));

    setStats(list);
    setLoading(false);
  };

  const sorted = [...stats].sort((a, b) => b[sortKey] - a[sortKey]);
  const total = stats.reduce((s, r) => s + r.total, 0);
  const totalAccepted = stats.reduce((s, r) => s + r.합격, 0);
  const overallRate = total > 0 ? Math.round((totalAccepted / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">대학별 합격률</h1>
      <p className="text-slate-500 text-sm mb-8">사용자가 등록한 데이터 기준입니다</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-slate-300" />
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">아직 등록된 데이터가 없습니다</p>
          <p className="text-sm mt-1">결과를 등록하면 통계가 자동으로 나타납니다</p>
        </div>
      ) : (
        <>
          {/* 요약 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <SummaryCard label="전체 등록" value={total} unit="건" />
            <SummaryCard label="합격" value={totalAccepted} unit="건" color="green" />
            <SummaryCard label="전체 합격률" value={overallRate} unit="%" color="blue" />
          </div>

          {/* 테이블 */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-sm">{stats.length}개 대학교</span>
              <div className="flex gap-2">
                {([['total', '건수순'], ['합격', '합격순'], ['rate', '합격률순']] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      sortKey === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wide">
                    <th className="text-left px-5 py-3">대학교</th>
                    <th className="text-center px-3 py-3 text-green-600">합격</th>
                    <th className="text-center px-3 py-3 text-red-500">불합격</th>
                    <th className="text-center px-3 py-3 text-yellow-500">대기</th>
                    <th className="text-center px-3 py-3 text-blue-500">인터뷰</th>
                    <th className="text-center px-3 py-3">전체</th>
                    <th className="text-center px-5 py-3">합격률</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sorted.map((s, i) => (
                    <tr key={s.university} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        <span className="text-slate-300 text-xs mr-2">{i + 1}</span>
                        {s.university}
                      </td>
                      <td className="text-center px-3 py-3 font-semibold text-green-600">{s.합격 || '—'}</td>
                      <td className="text-center px-3 py-3 text-red-400">{s.불합격 || '—'}</td>
                      <td className="text-center px-3 py-3 text-yellow-500">{s.대기 || '—'}</td>
                      <td className="text-center px-3 py-3 text-blue-400">{s.인터뷰 || '—'}</td>
                      <td className="text-center px-3 py-3 text-slate-500">{s.total}</td>
                      <td className="text-center px-5 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.rate >= 70 ? 'bg-green-500' : s.rate >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${s.rate}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold w-8 ${s.rate >= 70 ? 'text-green-600' : s.rate >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {s.rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, unit, color }: {
  label: string; value: number; unit: string; color?: 'green' | 'blue';
}) {
  const text = color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : 'text-slate-900';
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${text}`}>
        {value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}
