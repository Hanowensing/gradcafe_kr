import { GraduationCap, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-700 font-bold text-xl hover:text-blue-800 transition-colors">
            <GraduationCap size={28} />
            <span>studyhard</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-700 transition-colors">합격 결과</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <PlusCircle size={16} />
              결과 등록
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="text-slate-700 hover:text-blue-700 py-1" onClick={() => setMenuOpen(false)}>합격 결과</Link>
            <Link to="/submit" className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg w-fit mt-2" onClick={() => setMenuOpen(false)}>
              <PlusCircle size={16} />결과 등록
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
