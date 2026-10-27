import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { ListChildComponentProps } from 'react-window';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowDirectProps {
  index: number;
  song: Song;
  isFavorite?: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite?: (id: string) => void;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
  style?: CSSProperties;
}

export interface SongRowItemData {
  songs: Song[];
  favoriteIds?: Set<string> | string[];
  onPlay: (song: Song, index: number) => void;
  onToggleFavorite?: (id: string) => void;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
}

export type SongRowProps =
  | SongRowDirectProps
  | ListChildComponentProps<SongRowItemData>;

export const SongRow = memo(function SongRow(props: SongRowProps) {
  let song: Song;
  let index: number;
  let style: CSSProperties | undefined;
  let isFav = false;
  let handlePlay: () => void;
  let handleToggleFav: (() => void) | undefined;
  let handleAddToQueue: (() => void) | undefined;
  let handleAddToPlaylist: (() => void) | undefined;
  let canAddToPlaylist = false;
  let showPlaylistBtn = false;

  if ('data' in props && props.data) {
    index = props.index;
    style = props.style;
    song = props.data.songs[index];
    const favs = props.data.favoriteIds;
    if (favs instanceof Set) {
      isFav = favs.has(song.id);
    } else if (Array.isArray(favs)) {
      isFav = favs.includes(song.id);
    }
    const dataPlay = props.data.onPlay;
    handlePlay = () => dataPlay(song, index);
    const dataToggleFav = props.data.onToggleFavorite;
    if (dataToggleFav) {
      handleToggleFav = () => dataToggleFav(song.id);
    }
    const dataQueue = props.data.onAddToQueue;
    if (dataQueue) {
      handleAddToQueue = () => dataQueue(song);
    }
    const dataPlaylist = props.data.onAddToPlaylist;
    if (dataPlaylist) {
      showPlaylistBtn = true;
      handleAddToPlaylist = () => dataPlaylist(song);
    }
    canAddToPlaylist = Boolean(props.data.canAddToPlaylist);
  } else {
    const direct = props as SongRowDirectProps;
    index = direct.index;
    style = direct.style;
    song = direct.song;
    isFav = Boolean(direct.isFavorite);
    handlePlay = () => direct.onPlay(song);
    if (direct.onToggleFavorite) {
      handleToggleFav = () => direct.onToggleFavorite!(song.id);
    }
    if (direct.onAddToQueue) {
      handleAddToQueue = () => direct.onAddToQueue!(song);
    }
    if (direct.onAddToPlaylist) {
      showPlaylistBtn = true;
      handleAddToPlaylist = () => direct.onAddToPlaylist!(song);
    }
    canAddToPlaylist = Boolean(direct.canAddToPlaylist);
  }

  if (!song) return null;

  return (
    <div
      className="song-row"
      style={style}
      data-testid={`song-row-${song.id}`}
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
          onClick={handlePlay}
          aria-label="Phát"
          title="Phát bài này"
        >
          <span className="play-icon">▶</span>
        </button>
        <button
          type="button"
          className={`btn-action btn-heart ${isFav ? 'favorited' : ''}`}
          aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          onClick={handleToggleFav}
          title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {isFav ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="btn-action btn-queue"
          onClick={handleAddToQueue}
          aria-label="+ Hàng đợi"
          title="Thêm vào hàng đợi"
        >
          <span className="btn-icon">＋</span>
          <span className="btn-label">Hàng đợi</span>
        </button>
        {showPlaylistBtn && (
          <button
            type="button"
            className="btn-action btn-playlist"
            disabled={!canAddToPlaylist}
            onClick={handleAddToPlaylist}
            aria-label="+ Playlist"
            title={canAddToPlaylist ? 'Thêm vào playlist đang chọn' : 'Chưa chọn playlist'}
          >
            <span className="btn-icon">＋</span>
            <span className="btn-label">Playlist</span>
          </button>
        )}
      </div>
    </div>
  );
});
