import { useMemo } from 'react';
import { mockResults } from '../data/mockData';

export default function Stats() {
  const data = useMemo(() => {
    const byUniversity = mockResults.reduce<Record<string, { 합격: number; 불합격: number; 대기: number; 인터뷰: number }>>((acc, r) => {
      if (!acc[r.university]) acc[r.university] = { 합격: 0, 불합격: 0, 대기: 0, 인터뷰: 0 };
      acc[r.university][r.decision]++;
      return acc;
    }, {});

    const byDecision = mockResults.reduce<Record<string, number>>((acc, r) => {
      acc[r.decision] = (acc[r.decision] ?? 0) + 1;
      return acc;
    }, {});

    const avgGpa = mockResults
      .filter(r => r.gpa && r.decision === '합격')
      .reduce((sum, r, _, arr) => sum + (r.gpa! / arr.length), 0);

    return { byUniversity, byDecision, avgGpa };
  }, []);

  const total = mockResults.length;
  const decisionColors: Record<string, string> = {
    합격: 'bg-green-500',
    불합격: 'bg-red-400',
    대기: 'bg-yellow-400',
    인터뷰: 'bg-blue-400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">입시 통계</h1>
      <p className="text-slate-500 text-sm mb-8">등록된 데이터 기준의 통계입니다</p>

      {/* 전체 결과 비율 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">전체 결과 분포</h2>
        <div className="flex h-6 rounded-full overflow-hidden mb-4">
          {Object.entries(data.byDecision).map(([d, count]) => (
            <div
              key={d}
              className={`${decisionColors[d]} transition-all`}
              style={{ width: `${(count / total) * 100}%` }}
              title={`${d}: ${count}건`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(data.byDecision).map(([d, count]) => (
            <div key={d} className="flex items-center gap-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${decisionColors[d]}`} />
              <span className="text-slate-600">{d}</span>
              <span className="font-semibold text-slate-900">{count}건</span>
              <span className="text-slate-400">({Math.round((count / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </section>

      {/* 합격자 평균 학점 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">합격자 평균 스펙</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatBox label="평균 학점 (합격)" value={data.avgGpa.toFixed(2)} sub="/ 4.5" />
          <StatBox label="전체 등록 수" value={String(total)} sub="건" />
          <StatBox
            label="합격률"
            value={`${Math.round(((data.byDecision['합격'] ?? 0) / total) * 100)}%`}
            sub=""
          />
        </div>
      </section>

      {/* 대학별 현황 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">대학별 현황</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-slate-500 font-medium">대학교</th>
                <th className="text-center py-2 px-3 text-green-600 font-medium">합격</th>
                <th className="text-center py-2 px-3 text-red-500 font-medium">불합격</th>
                <th className="text-center py-2 px-3 text-yellow-600 font-medium">대기</th>
                <th className="text-center py-2 px-3 text-blue-600 font-medium">인터뷰</th>
                <th className="text-center py-2 pl-3 text-slate-500 font-medium">합격률</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.byUniversity)
                .sort((a, b) => (b[1].합격 + b[1].불합격 + b[1].대기 + b[1].인터뷰) - (a[1].합격 + a[1].불합격 + a[1].대기 + a[1].인터뷰))
                .map(([univ, counts]) => {
                  const total = counts.합격 + counts.불합격 + counts.대기 + counts.인터뷰;
                  const rate = Math.round((counts.합격 / total) * 100);
                  return (
                    <tr key={univ} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-slate-800">{univ}</td>
                      <td className="text-center py-3 px-3 text-green-600 font-semibold">{counts.합격}</td>
                      <td className="text-center py-3 px-3 text-red-500">{counts.불합격}</td>
                      <td className="text-center py-3 px-3 text-yellow-600">{counts.대기}</td>
                      <td className="text-center py-3 px-3 text-blue-600">{counts.인터뷰}</td>
                      <td className="text-center py-3 pl-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${rate >= 70 ? 'bg-green-100 text-green-700' : rate >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900">{value} <span className="text-base font-normal text-slate-400">{sub}</span></p>
    </div>
  );
}
