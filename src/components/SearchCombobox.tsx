import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  allowCustom?: boolean;
  clearable?: boolean;
}

export default function SearchCombobox({
  options,
  value,
  onChange,
  placeholder = '검색 또는 직접 입력',
  hasError = false,
  allowCustom = true,
  clearable = false,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length === 0
    ? options
    : options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  const showCustomOption =
    allowCustom &&
    query.trim().length > 0 &&
    !options.some(o => o === query.trim());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (allowCustom && query.trim() && !options.some(o => o === query.trim())) {
          onChange(query.trim());
        }
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, allowCustom, options, onChange]);

  const select = (val: string) => {
    onChange(val);
    setOpen(false);
    setQuery('');
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!open) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const exact = options.find(o => o.toLowerCase() === query.trim().toLowerCase());
      if (exact) {
        select(exact);
      } else if (allowCustom && query.trim()) {
        select(query.trim());
      }
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center w-full border rounded-xl px-3 py-2.5 text-sm bg-white cursor-pointer transition-all ${
          hasError
            ? 'border-red-400 ring-1 ring-red-400'
            : open
            ? 'border-blue-500 ring-2 ring-blue-500'
            : 'border-slate-200 hover:border-slate-300'
        }`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {open ? (
          <input
            ref={inputRef}
            autoFocus
            autoComplete="off"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={value ? value : placeholder}
            className="flex-1 outline-none bg-transparent text-slate-700 placeholder:text-slate-400 min-w-0"
          />
        ) : (
          <span className={`flex-1 truncate ${value ? 'text-slate-800' : 'text-slate-400'}`}>
            {value || placeholder}
          </span>
        )}
        <div className="flex items-center gap-1 ml-1 shrink-0">
          {clearable && value && !open && (
            <button onClick={clear} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {clearable && (
              <button
                onMouseDown={() => select('')}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                전체
              </button>
            )}

            {filtered.length === 0 && !showCustomOption && (
              <div className="px-4 py-3 text-sm text-slate-400 text-center">
                검색 결과가 없습니다
              </div>
            )}

            {filtered.map(opt => (
              <button
                key={opt}
                onMouseDown={() => select(opt)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                  value === opt ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}

            {showCustomOption && (
              <button
                onMouseDown={() => select(query.trim())}
                className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100 font-medium"
              >
                <span className="text-slate-400 font-normal">직접 입력: </span>
                &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
