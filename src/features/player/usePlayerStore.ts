import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number; // đơn vị: giây
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,

  playQueue: (songs: Song[], startIndex: number) => {
    if (songs.length === 0) return;
    const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: songs,
      currentIndex: validIndex,
      position: 0,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    const { isPlaying, queue, currentIndex } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, position: 0, isPlaying: true });
    } else {
      set({ isPlaying: !isPlaying });
    }
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0 || currentIndex >= queue.length - 1) {
      // next() ở bài cuối thì dừng phát
      set({ isPlaying: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
        isPlaying: true,
      });
    }
  },

  prev: () => {
    const { position, currentIndex } = get();
    if (currentIndex < 0) return;

    // prev() khi đã phát quá 3 giây thì chỉ tua về 0:00
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      // ngược lại lùi về bài trước
      set({
        currentIndex: currentIndex - 1,
        position: 0,
        isPlaying: true,
      });
    } else {
      // bài đầu thì tua về 0:00
      set({ position: 0 });
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get();
    // bài đã có trong hàng đợi thì bỏ qua
    if (queue.some((s) => s.id === song.id)) {
      return;
    }
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { queue, currentIndex, position, isPlaying } = get();
    if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }

    const currentSong = queue[currentIndex];
    // Tăng position 1 giây; hết bài thì tự gọi next()
    if (position + 1 >= currentSong.duration) {
      get().next();
    } else {
      set({ position: position + 1 });
    }
  },
}));
