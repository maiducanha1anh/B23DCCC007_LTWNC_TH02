import { useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import type { Song } from '../../types';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = useMemo(
    () => playlists.find((p) => p.id === id),
    [playlists, id]
  );

  const songs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map((songId) => SONGS.find((s) => s.id === songId))
      .filter((song): song is Song => Boolean(song));
  }, [playlist]);

  // Yêu cầu: dòng Tổng thời lượng: X phút Y giây (dùng reduce)
  const { minutes, seconds } = useMemo(() => {
    const totalSeconds = songs.reduce((acc, song) => acc + song.duration, 0);
    return {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60,
    };
  }, [songs]);

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) {
      playQueue(songs, 0);
    }
  }, [songs, playQueue]);

  const handlePlaySingle = useCallback(
    (index: number) => {
      playQueue(songs, index);
    },
    [songs, playQueue]
  );

  const handleRemoveSong = useCallback(
    (songId: string) => {
      if (playlist) {
        dispatch({
          type: 'removeSong',
          payload: { playlistId: playlist.id, songId },
        });
      }
    },
    [playlist, dispatch]
  );

  if (!playlist) {
    return (
      <div className="playlist-detail-page">
        <div className="empty-state">Không tìm thấy playlist.</div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/playlists" className="btn-action btn-queue">
            ← Quay lại danh sách playlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-detail-page">
      <div className="page-actions-header">
        <div>
          <h1 className="page-title">{playlist.name}</h1>
          <p className="search-result-count">
            Tổng thời lượng: {minutes} phút {seconds} giây
          </p>
        </div>

        {songs.length > 0 && (
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

      {songs.length === 0 ? (
        <div className="empty-state">
          Playlist chưa có bài hát nào. Bạn có thể thêm bài hát từ trang Thư viện!
        </div>
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

          <div className="playlist-songs-list">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="song-row"
                data-testid={`playlist-song-${song.id}`}
              >
                <div className="song-col song-index">{index + 1}</div>
                <div className="song-col song-title" title={song.title}>
                  {song.title}
                </div>
                <div className="song-col song-artist" title={song.artist}>
                  {song.artist}
                </div>
                <div className="song-col song-genre">
                  <span className="genre-badge">{song.genre}</span>
                </div>
                <div className="song-col song-duration">
                  {formatDuration(song.duration)}
                </div>
                <div className="song-col song-actions">
                  <button
                    type="button"
                    className="btn-action btn-play btn-play-round"
                    onClick={() => handlePlaySingle(index)}
                    aria-label="Phát"
                    title="Phát bài này"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleRemoveSong(song.id)}
                    aria-label="Bỏ"
                    title="Bỏ bài hát khỏi playlist"
                  >
                    ✕ Bỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
