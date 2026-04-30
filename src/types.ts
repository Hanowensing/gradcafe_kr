export type Decision = '합격' | '불합격' | '대기' | '인터뷰';
export type Degree = '석사' | '박사' | '석박통합';
export type Season = string;

export interface AdmissionResult {
  id: string;
  university: string;
  department: string;
  degree: Degree;
  decision: Decision;
  season: Season;
  gpa?: number;
  gpaMax?: number;
  englishScore?: number;
  englishType?: 'TOEIC' | 'TOEFL' | 'IELTS';
  researchExp?: boolean;
  paperCount?: number;
  referralSource?: string;
  note?: string;
  createdAt: string;
  upvotes: number;
  comments: Comment[];
  commentCount?: number;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface SearchFilters {
  university: string;
  department: string;
  degree: string;
  decision: string;
  season: string;
}
