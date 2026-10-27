import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';

describe('FavoritesPage component', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('hiển thị thông báo "Bạn chưa có bài hát yêu thích." khi danh sách rỗng', () => {
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Phát tất cả' })).not.toBeInTheDocument();
  });

  it('hiển thị danh sách các bài hát yêu thích và nút Phát tất cả khi có bài hát', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('2 bài hát đã lưu')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();

    const playAllButton = screen.getByRole('button', { name: 'Phát tất cả' });
    expect(playAllButton).toBeInTheDocument();

    await user.click(playAllButton);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.currentIndex).toBe(0);
    expect(playerState.queue).toHaveLength(2);
  });
});
