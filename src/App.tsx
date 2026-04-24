import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ResultDetail from './pages/ResultDetail';
import SubmitResult from './pages/SubmitResult';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result/:id" element={<ResultDetail />} />
            <Route path="/submit" element={<SubmitResult />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 mt-16 py-8 text-center text-sm text-slate-400">
          <p>studyhard — 한국 대학원 입시 정보 공유 커뮤니티</p>
          <p className="mt-1 text-xs">모든 정보는 익명으로 공유됩니다</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App
