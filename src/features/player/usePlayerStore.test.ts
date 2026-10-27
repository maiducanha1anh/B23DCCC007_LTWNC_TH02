import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './usePlayerStore';
import type { Song } from '../../types';

describe('usePlayerStore', () => {
  const mockSongs: Song[] = [
    { id: 's1', title: 'Bài hát 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 180 },
    { id: 's2', title: 'Bài hát 2', artist: 'Ca sĩ 2', genre: 'Ballad', duration: 200 },
    { id: 's3', title: 'Bài hát 3', artist: 'Ca sĩ 3', genre: 'Rock', duration: 160 },
  ];

  beforeEach(() => {
    // Đặt lại store trước mỗi test bằng usePlayerStore.setState(...) theo yêu cầu
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('playQueue đặt đúng bài hát, hàng đợi, vị trí 0 và isPlaying là true', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);

    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(mockSongs);
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('tick ở giây cuối tự động chuyển sang bài sau và reset vị trí về 0', () => {
    usePlayerStore.getState().playQueue(mockSongs, 0);

    // Bài 1 có duration = 180s. Đặt position ở giây cuối: 179s
    usePlayerStore.setState({ position: 179 });

    // Gọi tick(): position + 1 = 180 >= duration -> gọi next()
    usePlayerStore.getState().tick();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('next ở bài cuối thì isPlaying chuyển thành false', () => {
    // Phát từ bài cuối cùng (index 2)
    usePlayerStore.getState().playQueue(mockSongs, 2);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    // Gọi next() ở bài cuối
    usePlayerStore.getState().next();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
  });

  it('prev khi phát quá 3 giây chỉ tua về 0:00, khi <= 3 giây lùi về bài trước', () => {
    usePlayerStore.getState().playQueue(mockSongs, 1);

    // Phát đến giây thứ 10 (> 3)
    usePlayerStore.setState({ position: 10 });
    usePlayerStore.getState().prev();

    let state = usePlayerStore.getState();
    expect(state.position).toBe(0);
    expect(state.currentIndex).toBe(1);

    // Phát ở giây thứ 2 (<= 3) -> lùi về bài trước
    usePlayerStore.setState({ position: 2 });
    usePlayerStore.getState().prev();

    state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm bài vào cuối hàng đợi và không thêm trùng', () => {
    usePlayerStore.getState().addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(1);

    // Thêm lại bài đã có -> bỏ qua
    usePlayerStore.getState().addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(1);

    // Thêm bài mới
    usePlayerStore.getState().addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });
});
