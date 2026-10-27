import { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export function PlayerBar() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, tick]);

  // Phím tắt Space để Phát/Tạm dừng
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (
          activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'select'
        ) {
          return;
        }
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay]);

  return (
    <footer className="player-bar" data-testid="player-bar">
      <div className="player-track-info">
        {currentSong ? (
          <>
            <div className="player-track-title" title={currentSong.title}>
              Đang phát: {currentSong.title} – {currentSong.artist}
            </div>
            <div className="player-track-artist">
              <span className="genre-badge">{currentSong.genre}</span>
            </div>
          </>
        ) : (
          <div className="player-track-title">Chưa phát bài nào</div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="btn-control btn-nav-track"
            onClick={prev}
            disabled={queueLength === 0}
            aria-label="Trước"
            title="Trước (Bài trước)"
          >
            ⏮
          </button>
          <button
            type="button"
            className="btn-control btn-play-main"
            onClick={togglePlay}
            disabled={queueLength === 0}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            className="btn-control btn-nav-track"
            onClick={next}
            disabled={queueLength === 0}
            aria-label="Sau"
            title="Sau (Bài kế tiếp)"
          >
            ⏭
          </button>
        </div>
        <ProgressBar />
      </div>

      <div className="player-right">
        <div className="queue-badge">Hàng đợi: {queueLength} bài</div>
      </div>
    </footer>
  );
}
