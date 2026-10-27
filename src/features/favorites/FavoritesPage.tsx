import { useMemo, useCallback } from 'react';
import { SONGS } from '../../data/songs';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { SongRow } from '../library/SongRow';
import type { Song } from '../../types';

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const favoriteSongs = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return SONGS.filter((song) => idSet.has(song.id));
  }, [favoriteIds]);

  const handlePlayAll = useCallback(() => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  }, [favoriteSongs, playQueue]);

  const handlePlaySingle = useCallback(
    (song: Song) => {
      const idx = favoriteSongs.findIndex((s) => s.id === song.id);
      playQueue(favoriteSongs, idx >= 0 ? idx : 0);
    },
    [favoriteSongs, playQueue]
  );

  return (
    <div className="favorites-page">
      <div className="page-actions-header">
        <div>
          <h1 className="page-title">Bài hát yêu thích</h1>
          <p className="search-result-count">
            {favoriteSongs.length > 0
              ? `${favoriteSongs.length} bài hát đã lưu`
              : ''}
          </p>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            type="button"
            className="btn-action btn-play"
            onClick={handlePlayAll}
            aria-label="Phát tất cả"
            style={{ padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>▶</span>
            <span>Phát tất cả</span>
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="empty-state">Bạn chưa có bài hát yêu thích.</div>
      ) : (
        <div className="virtual-list-container">
          <div className="song-table-header">
            <div className="song-col song-index">#</div>
            <div className="song-col song-title">Tên bài</div>
            <div className="song-col song-artist">Ca sĩ</div>
            <div className="song-col song-genre">Thể loại</div>
            <div className="song-col song-duration">Thời lượng</div>
            <div className="song-col song-actions">Hành động</div>
          </div>
          <div className="favorites-list">
            {favoriteSongs.map((song, index) => (
              <SongRow
                key={song.id}
                index={index}
                song={song}
                isFavorite={true}
                onPlay={handlePlaySingle}
                onToggleFavorite={toggleFavorite}
                onAddToQueue={addToQueue}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
