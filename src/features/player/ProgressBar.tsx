import { memo } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar = memo(function ProgressBar() {
  // Chỉ component này đọc position để chống re-render các component khác mỗi giây
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex].duration
      : 0
  );

  const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="player-progress-area" data-testid="player-progress-bar">
      <span className="time-display">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div className="progress-track" role="progressbar" aria-valuenow={position} aria-valuemax={duration} aria-valuemin={0}>
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});
