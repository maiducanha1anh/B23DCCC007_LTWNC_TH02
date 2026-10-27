import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';
import type { Song } from '../../types';

describe('PlayerBar component', () => {
  const mockSongs: Song[] = [
    { id: 's1', title: 'Bài hát 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 180 },
    { id: 's2', title: 'Bài hát 2', artist: 'Ca sĩ 2', genre: 'Ballad', duration: 200 },
  ];

  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị "Chưa phát bài nào" và các nút bị vô hiệu hóa khi hàng đợi rỗng', () => {
    render(<PlayerBar />);

    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();

    const playBtn = screen.getByRole('button', { name: 'Phát' });
    expect(playBtn).toBeDisabled();
  });

  it('hiển thị thông tin bài đang phát và điều khiển Phát/Tạm dừng', async () => {
    const user = userEvent.setup();
    usePlayerStore.getState().playQueue(mockSongs, 0);

    render(<PlayerBar />);

    expect(
      screen.getByText('Đang phát: Bài hát 1 – Ca sĩ 1')
    ).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    expect(pauseBtn).toBeInTheDocument();

    await user.click(pauseBtn);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('chuyển bài kế tiếp khi bấm nút Sau', async () => {
    const user = userEvent.setup();
    usePlayerStore.getState().playQueue(mockSongs, 0);

    render(<PlayerBar />);

    const nextBtn = screen.getByRole('button', { name: 'Sau' });
    await user.click(nextBtn);

    expect(
      screen.getByText('Đang phát: Bài hát 2 – Ca sĩ 2')
    ).toBeInTheDocument();
  });

  it('chạy đồng hồ tick mỗi giây khi đang phát nhạc', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue(mockSongs, 0);

    render(<PlayerBar />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(usePlayerStore.getState().position).toBe(3);
  });
});
