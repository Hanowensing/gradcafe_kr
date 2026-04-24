import type { Decision } from '../types';

const styles: Record<Decision, string> = {
  합격: 'bg-green-100 text-green-800 border border-green-200',
  불합격: 'bg-red-100 text-red-800 border border-red-200',
  대기: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  인터뷰: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export default function DecisionBadge({ decision }: { decision: Decision }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[decision]}`}>
      {decision}
    </span>
  );
}
