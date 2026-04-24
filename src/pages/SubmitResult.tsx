import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UNIVERSITIES, DEPARTMENTS, SEASONS } from '../data/mockData';
import type { Decision, Degree, Season } from '../types';
import SearchCombobox from '../components/SearchCombobox';

interface FormData {
  university: string;
  department: string;
  degree: Degree | '';
  decision: Decision | '';
  season: Season | '';
  gpa: string;
  gpaMax: string;
  englishType: 'TOEIC' | 'TOEFL' | 'IELTS' | '';
  englishScore: string;
  researchExp: 'true' | 'false' | '';
  note: string;
}

const init: FormData = {
  university: '', department: '',
  degree: '', decision: '', season: '', gpa: '', gpaMax: '4.5',
  englishType: '', englishScore: '', researchExp: '', note: '',
};

export default function SubmitResult() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(init);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.university) errs.university = '대학교를 입력해주세요';
    if (!form.department) errs.department = '학과를 입력해주세요';
    if (!form.degree) errs.degree = '학위를 선택해주세요';
    if (!form.decision) errs.decision = '결과를 선택해주세요';
    if (!form.season) errs.season = '시즌을 선택해주세요';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">등록 완료!</h2>
        <p className="text-slate-500 mb-8">소중한 경험을 공유해주셔서 감사합니다.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setForm(init); setSubmitted(false); }}
            className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            추가 등록
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            목록 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">결과 등록</h1>
        <p className="text-slate-500 text-sm mb-8">익명으로 등록됩니다. 솔직한 경험을 나눠주세요.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 대학교 */}
          <FormGroup label="대학교 *" error={errors.university}>
            <SearchCombobox
              options={UNIVERSITIES}
              value={form.university}
              onChange={v => update('university', v)}
              placeholder="대학교 검색 또는 직접 입력"
              hasError={!!errors.university}
              allowCustom
            />
          </FormGroup>

          {/* 학과 */}
          <FormGroup label="학과 *" error={errors.department}>
            <SearchCombobox
              options={DEPARTMENTS}
              value={form.department}
              onChange={v => update('department', v)}
              placeholder="학과 검색 또는 직접 입력"
              hasError={!!errors.department}
              allowCustom
            />
          </FormGroup>

          {/* 학위 / 결과 */}
          <div className="grid grid-cols-2 gap-4">
            <FormGroup label="학위 *" error={errors.degree}>
              <select value={form.degree} onChange={e => update('degree', e.target.value)} className={inputClass(!!errors.degree)}>
                <option value="">선택</option>
                <option>석사</option>
                <option>박사</option>
                <option>석박통합</option>
              </select>
            </FormGroup>
            <FormGroup label="결과 *" error={errors.decision}>
              <select value={form.decision} onChange={e => update('decision', e.target.value)} className={inputClass(!!errors.decision)}>
                <option value="">선택</option>
                <option>합격</option>
                <option>불합격</option>
                <option>대기</option>
                <option>인터뷰</option>
              </select>
            </FormGroup>
          </div>

          {/* 시즌 */}
          <FormGroup label="시즌 *" error={errors.season}>
            <select value={form.season} onChange={e => update('season', e.target.value)} className={inputClass(!!errors.season)}>
              <option value="">선택하세요</option>
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormGroup>

          {/* 학점 */}
          <FormGroup label="학점 (선택)">
            <div className="grid grid-cols-2 gap-3 items-center">
              <input
                type="number" step="0.01" min="0" max="5"
                placeholder="예: 4.2"
                value={form.gpa}
                onChange={e => update('gpa', e.target.value)}
                className={inputClass(false)}
              />
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm shrink-0">/ 만점</span>
                <select
                  value={form.gpaMax}
                  onChange={e => update('gpaMax', e.target.value)}
                  className={inputClass(false)}
                >
                  <option value="4.5">4.5</option>
                  <option value="4.3">4.3</option>
                  <option value="4.0">4.0</option>
                </select>
              </div>
            </div>
          </FormGroup>

          {/* 영어 성적 */}
          <FormGroup label="영어 성적 (선택)">
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.englishType}
                onChange={e => update('englishType', e.target.value)}
                className={inputClass(false)}
              >
                <option value="">시험 종류</option>
                <option>TOEIC</option>
                <option>TOEFL</option>
                <option>IELTS</option>
              </select>
              <input
                type="number"
                placeholder="점수 입력"
                value={form.englishScore}
                onChange={e => update('englishScore', e.target.value)}
                className={inputClass(false)}
              />
            </div>
          </FormGroup>

          {/* 연구 경험 */}
          <FormGroup label="연구 경험 (선택)">
            <div className="flex gap-3">
              {(['true', 'false'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => update('researchExp', v)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    form.researchExp === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {v === 'true' ? '있음' : '없음'}
                </button>
              ))}
            </div>
          </FormGroup>

          {/* 메모 */}
          <FormGroup label="경험 공유 (선택)">
            <textarea
              rows={4}
              placeholder="면접 내용, 준비 과정, 느낀 점 등 자유롭게 작성해주세요"
              value={form.note}
              onChange={e => update('note', e.target.value)}
              className={`${inputClass(false)} resize-none`}
            />
          </FormGroup>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            익명으로 등록하기
          </button>
        </form>
      </div>
    </div>
  );
}

function FormGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border ${hasError ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`;
}
