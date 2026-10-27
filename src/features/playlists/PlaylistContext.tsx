import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { Playlist, PlaylistAction } from './playlistReducer';
import { playlistReducer } from './playlistReducer';
import { withLogger } from './withLogger';

const STORAGE_KEY = 'music-playlists';

export const PlaylistStateContext = createContext<Playlist[] | undefined>(
  undefined
);
export const PlaylistDispatchContext = createContext<
  Dispatch<PlaylistAction> | undefined
>(undefined);

const loadInitialPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Không thể đọc dữ liệu playlists từ localStorage', err);
  }
  return [];
};

export function PlaylistProvider({
  children,
  initialPlaylists,
}: {
  children: ReactNode;
  initialPlaylists?: Playlist[];
}) {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    initialPlaylists ?? undefined,
    (init) => init ?? loadInitialPlaylists()
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch (err) {
      console.error('Không thể lưu playlists vào localStorage', err);
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists phải được sử dụng bên trong PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error(
      'usePlaylistDispatch phải được sử dụng bên trong PlaylistProvider'
    );
  }
  return context;
}
