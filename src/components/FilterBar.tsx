import type { SearchFilters } from '../types';
import { UNIVERSITIES, DEPARTMENTS, SEASONS } from '../data/mockData';
import SearchCombobox from './SearchCombobox';

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const DECISIONS = ['합격', '불합격', '대기', '인터뷰'];
const DEGREES = ['석사', '박사', '석박통합'];

export default function FilterBar({ filters, onChange }: Props) {
  const update = (key: keyof SearchFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label className="text-xs font-medium text-slate-500">대학교</label>
        <SearchCombobox
          options={UNIVERSITIES}
          value={filters.university}
          onChange={v => update('university', v)}
          placeholder="전체 (검색)"
          allowCustom={false}
          clearable
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label className="text-xs font-medium text-slate-500">학과</label>
        <SearchCombobox
          options={DEPARTMENTS}
          value={filters.department}
          onChange={v => update('department', v)}
          placeholder="전체 (검색)"
          allowCustom={false}
          clearable
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[100px]">
        <label className="text-xs font-medium text-slate-500">학위</label>
        <select
          value={filters.degree}
          onChange={e => update('degree', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">전체</option>
          {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[100px]">
        <label className="text-xs font-medium text-slate-500">결과</label>
        <select
          value={filters.decision}
          onChange={e => update('decision', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">전체</option>
          {DECISIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[130px]">
        <label className="text-xs font-medium text-slate-500">시즌</label>
        <select
          value={filters.season}
          onChange={e => update('season', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">전체</option>
          {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <button
        onClick={() => onChange({ university: '', department: '', degree: '', decision: '', season: '' })}
        className="px-4 py-2.5 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
      >
        초기화
      </button>
    </div>
  );
}
