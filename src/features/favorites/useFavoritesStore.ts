import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((songId) => songId !== id) });
        } else {
          set({ ids: [...ids, id] });
        }
      },
    }),
    {
      name: 'music-favorites',
    }
  )
);
