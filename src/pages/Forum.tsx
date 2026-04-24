import { useState } from 'react';
import { MessageSquare, ThumbsUp, Pin, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  commentCount: number;
  createdAt: string;
  pinned?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: '연구계획서(SOP) 작성 팁 공유합니다',
    body: '여러 합격자들의 SOP를 참고해서 정리한 내용입니다. 교수님 연구와의 연결고리가 가장 중요합니다...',
    category: '정보공유',
    upvotes: 87,
    commentCount: 23,
    createdAt: '2025-03-10T08:00:00Z',
    pinned: true,
  },
  {
    id: '2',
    title: 'KAIST 컴공 25년 가을 면접 후기',
    body: '오늘 면접 봤습니다. 기술 면접이 생각보다 심층적이었고...',
    category: '면접후기',
    upvotes: 52,
    commentCount: 14,
    createdAt: '2025-03-15T14:00:00Z',
  },
  {
    id: '3',
    title: '학점이 낮은 경우 대학원 진학 가능한가요?',
    body: '학점이 3.3정도 되는데 좋은 대학원 진학이 어려울까요? 연구 경험은 있습니다.',
    category: '질문',
    upvotes: 34,
    commentCount: 31,
    createdAt: '2025-03-18T11:00:00Z',
  },
  {
    id: '4',
    title: '서울대 / KAIST / POSTECH 석박통합 비교',
    body: '세 학교 모두 합격한 경우 어디를 선택하는 게 좋을까요? 장단점을 비교해봤습니다...',
    category: '정보공유',
    upvotes: 128,
    commentCount: 45,
    createdAt: '2025-02-20T09:00:00Z',
  },
  {
    id: '5',
    title: '대학원 지원 시 지도교수 사전 컨택 필수인가요?',
    body: '학교마다 다른 것 같은데, 일반적으로 어떻게 하나요?',
    category: '질문',
    upvotes: 61,
    commentCount: 28,
    createdAt: '2025-03-05T16:00:00Z',
  },
  {
    id: '6',
    title: '산업계 → 대학원 진학 경험 공유',
    body: '5년 경력 후 박사 진학한 경험을 공유합니다. 나이가 걱정이신 분들 보세요...',
    category: '경험공유',
    upvotes: 203,
    commentCount: 67,
    createdAt: '2025-01-30T10:00:00Z',
  },
];

const CATEGORIES = ['전체', '정보공유', '질문', '면접후기', '경험공유', '잡담'];

const categoryColors: Record<string, string> = {
  정보공유: 'bg-blue-100 text-blue-700',
  질문: 'bg-purple-100 text-purple-700',
  면접후기: 'bg-orange-100 text-orange-700',
  경험공유: 'bg-green-100 text-green-700',
  잡담: 'bg-slate-100 text-slate-600',
};

export default function Forum() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const filtered = activeCategory === '전체'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const pinned = filtered.filter(p => p.pinned);
  const normal = filtered.filter(p => !p.pinned).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">자유게시판</h1>
          <p className="text-slate-500 text-sm mt-1">대학원 관련 정보와 경험을 자유롭게 나눠보세요</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <PlusCircle size={16} />
          글쓰기
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 고정글 */}
      {pinned.length > 0 && (
        <div className="space-y-3 mb-4">
          {pinned.map(post => <PostItem key={post.id} post={post} onUpvote={(id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))} />)}
        </div>
      )}

      {/* 일반글 */}
      <div className="space-y-3">
        {normal.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>아직 게시글이 없습니다</p>
          </div>
        )}
        {normal.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onUpvote={(id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))}
          />
        ))}
      </div>

      {/* 글쓰기 모달 */}
      {showModal && (
        <WriteModal
          onClose={() => setShowModal(false)}
          onSubmit={(post) => {
            setPosts(prev => [post, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function PostItem({ post, onUpvote }: { post: Post; onUpvote: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all p-5 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {post.pinned && (
              <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                <Pin size={12} />공지
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] ?? 'bg-slate-100 text-slate-600'}`}>
              {post.category}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug hover:text-blue-700 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.body}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
        <span className="text-xs text-slate-400">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(post.id); }}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-sm"
          >
            <ThumbsUp size={14} />
            {post.upvotes}
          </button>
          <span className="flex items-center gap-1 text-slate-400 text-sm">
            <MessageSquare size={14} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function WriteModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (post: Post) => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('정보공유');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      category,
      upvotes: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 mb-5">글쓰기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">카테고리</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">내용</label>
            <textarea
              rows={5}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="내용을 입력하세요"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}
