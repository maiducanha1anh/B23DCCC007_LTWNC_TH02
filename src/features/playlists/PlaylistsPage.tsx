import { useState, useCallback, useMemo } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

function CreatePlaylistForm({ existingNames }: { existingNames: string[] }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dispatch = usePlaylistDispatch();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();

      if (!trimmed) {
        setError('Tên playlist không được để trống');
        return;
      }

      const isDuplicate = existingNames.some(
        (existing) => existing.toLowerCase() === trimmed.toLowerCase()
      );

      if (isDuplicate) {
        setError('Tên playlist đã tồn tại');
        return;
      }

      dispatch({ type: 'create', payload: { name: trimmed } });
      setName('');
      setError('');
    },
    [name, existingNames, dispatch]
  );

  return (
    <form className="form-create-playlist" onSubmit={handleSubmit}>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Nhập tên playlist mới..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
          aria-label="Tên playlist"
        />
        {error && <p className="form-error">{error}</p>}
      </div>
      <button
        type="submit"
        className="btn-action btn-play"
        aria-label="Tạo"
        style={{ padding: '10px 24px', borderRadius: '8px', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <span>＋</span>
        <span>Tạo</span>
      </button>
    </form>
  );
}

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const existingNames = useMemo(
    () => playlists.map((p) => p.name),
    [playlists]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch({ type: 'remove', payload: { id } });
    },
    [dispatch]
  );

  return (
    <div className="playlists-page">
      <h1 className="page-title">Danh sách playlist</h1>

      <CreatePlaylistForm existingNames={existingNames} />

      {playlists.length === 0 ? (
        <div className="empty-state">Chưa có playlist nào. Hãy tạo playlist đầu tiên!</div>
      ) : (
        <div className="playlist-grid">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              <div>
                <Link
                  to={`/playlists/${playlist.id}`}
                  className="playlist-card-title"
                >
                  {playlist.name}
                </Link>
                <div className="playlist-card-count">
                  {playlist.songIds.length} bài
                </div>
              </div>

              <div className="playlist-card-actions">
                <Link
                  to={`/playlists/${playlist.id}`}
                  className="btn-action btn-queue"
                >
                  👁 Chi tiết
                </Link>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(playlist.id)}
                  aria-label="Xóa"
                  title="Xóa playlist"
                >
                  🗑 Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
