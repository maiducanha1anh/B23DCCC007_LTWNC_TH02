import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlaylistDetailPage from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import type { Playlist } from './playlistReducer';

const initialPlaylists: Playlist[] = [
  {
    id: 'pl_test',
    name: 'Chạy bộ buổi sáng',
    songIds: ['s1', 's2'], // s1: 150s, s2: 187s -> tổng 337s = 5 phút 37 giây
  },
];

function renderDetailPage(playlistId: string) {
  return render(
    <MemoryRouter initialEntries={[`/playlists/${playlistId}`]}>
      <PlaylistProvider initialPlaylists={initialPlaylists}>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </PlaylistProvider>
    </MemoryRouter>
  );
}

describe('PlaylistDetailPage component', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('hiển thị thông báo "Không tìm thấy playlist." khi id không hợp lệ', () => {
    renderDetailPage('invalid_id');
    expect(screen.getByText('Không tìm thấy playlist.')).toBeInTheDocument();
  });

  it('hiển thị tên playlist và đúng tổng thời lượng 5 phút 37 giây', () => {
    renderDetailPage('pl_test');

    expect(screen.getByText('Chạy bộ buổi sáng')).toBeInTheDocument();
    expect(
      screen.getByText('Tổng thời lượng: 5 phút 37 giây')
    ).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm nút Phát tất cả sẽ nạp toàn bộ bài hát vào hàng đợi phát nhạc', async () => {
    const user = userEvent.setup();
    renderDetailPage('pl_test');

    const playAllBtn = screen.getByRole('button', { name: 'Phát tất cả' });
    await user.click(playAllBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.queue).toHaveLength(2);
    expect(playerState.currentIndex).toBe(0);
  });

  it('bấm nút Bỏ để xóa bài hát khỏi playlist', async () => {
    const user = userEvent.setup();
    renderDetailPage('pl_test');

    const removeButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    expect(removeButtons).toHaveLength(2);

    await user.click(removeButtons[0]);

    // Bài s1 đã bị bỏ, chỉ còn 1 bài
    const remainingRemoveButtons = screen.getAllByRole('button', { name: 'Bỏ' });
    expect(remainingRemoveButtons).toHaveLength(1);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
  });
});
