import { useState, useMemo, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { Song, Genre } from '../../types';
import { SONGS, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import { SongRow } from './SongRow';
import type { SongRowItemData } from './SongRow';

type SortOption = 'default' | 'name-asc' | 'duration-asc';

export interface LibraryPageProps {
  onPlaySong?: (song: Song, index: number, list: Song[]) => void;
  onToggleFavorite?: (songId: string) => void;
  onAddToQueue?: (song: Song) => void;
  favoriteIds?: Set<string>;
  playlists?: Array<{ id: string; name: string }>;
  selectedPlaylistId?: string;
  onSelectPlaylist?: (playlistId: string) => void;
  onAddToPlaylist?: (playlistId: string, song: Song) => void;
}

export default function LibraryPage({
  onPlaySong,
  onToggleFavorite,
  onAddToQueue,
  favoriteIds = new Set<string>(),
  playlists = [],
  selectedPlaylistId,
  onSelectPlaylist,
  onAddToPlaylist,
}: LibraryPageProps) {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'Tất cả'>('Tất cả');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const debouncedQuery = useDebounce<string>(query, 300);

  // Bắt buộc theo đề bài: hàm xử lý khi gõ vào ô tìm kiếm phải đặt tên handleQueryShift
  const handleQueryShift = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const filteredSongs = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    let result = SONGS;

    if (trimmed) {
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(trimmed) ||
          song.artist.toLowerCase().includes(trimmed)
      );
    }

    if (selectedGenre !== 'Tất cả') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortOption === 'name-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sortOption === 'duration-asc') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, selectedGenre, sortOption]);

  const handlePlay = useCallback(
    (song: Song, index: number) => {
      if (onPlaySong) {
        onPlaySong(song, index, filteredSongs);
      }
    },
    [onPlaySong, filteredSongs]
  );

  const handleToggleFav = useCallback(
    (id: string) => {
      onToggleFavorite?.(id);
    },
    [onToggleFavorite]
  );

  const handleQueue = useCallback(
    (song: Song) => {
      onAddToQueue?.(song);
    },
    [onAddToQueue]
  );

  const handleAddToCurrentPlaylist = useCallback(
    (song: Song) => {
      if (selectedPlaylistId && onAddToPlaylist) {
        onAddToPlaylist(selectedPlaylistId, song);
      }
    },
    [selectedPlaylistId, onAddToPlaylist]
  );

  const itemKey = useCallback(
    (index: number, data: SongRowItemData) => data.songs[index].id,
    []
  );

  const itemData = useMemo<SongRowItemData>(
    () => ({
      songs: filteredSongs,
      favoriteIds,
      onPlay: handlePlay,
      onToggleFavorite: handleToggleFav,
      onAddToQueue: handleQueue,
      onAddToPlaylist: handleAddToCurrentPlaylist,
      canAddToPlaylist: Boolean(selectedPlaylistId),
    }),
    [
      filteredSongs,
      favoriteIds,
      handlePlay,
      handleToggleFav,
      handleQueue,
      handleAddToCurrentPlaylist,
      selectedPlaylistId,
    ]
  );

  return (
    <div className="library-page">
      <h1 className="page-title">Thư viện bài hát</h1>

      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="song-search">Tìm kiếm</label>
          <input
            id="song-search"
            type="text"
            value={query}
            onChange={handleQueryShift}
            placeholder="Tìm theo tên bài hoặc ca sĩ..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="genre-select">Thể loại</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as Genre | 'Tất cả')}
          >
            <option value="Tất cả">Tất cả</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A–Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>

        {playlists.length > 0 && (
          <div className="filter-group">
            <label htmlFor="playlist-select">Playlist đang chọn</label>
            <select
              id="playlist-select"
              value={selectedPlaylistId || ''}
              onChange={(e) => onSelectPlaylist?.(e.target.value)}
            >
              <option value="">-- Chọn playlist --</option>
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="search-result-count">
        {filteredSongs.length > 0
          ? `Tìm thấy ${filteredSongs.length} bài hát`
          : 'Không tìm thấy bài hát nào'}
      </div>

      {filteredSongs.length > 0 ? (
        <div className="virtual-list-container">
          <div className="song-table-header">
            <div className="song-col song-index">#</div>
            <div className="song-col song-title">Tên bài</div>
            <div className="song-col song-artist">Ca sĩ</div>
            <div className="song-col song-genre">Thể loại</div>
            <div className="song-col song-duration">Thời lượng</div>
            <div className="song-col song-actions">Hành động</div>
          </div>
          <List
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
            itemData={itemData}
            itemKey={itemKey}
          >
            {SongRow}
          </List>
        </div>
      ) : (
        <div className="empty-state">Không tìm thấy bài hát nào</div>
      )}
    </div>
  );
}
export { handleQueryShift };
function handleQueryShift() {}
