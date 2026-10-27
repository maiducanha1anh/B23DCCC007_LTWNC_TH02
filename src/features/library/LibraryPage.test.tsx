import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import LibraryPage from './LibraryPage';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import type { Playlist } from '../playlists/playlistReducer';

const mockPlaylists: Playlist[] = [
  { id: 'pl_1', name: 'Nhạc thư giãn', songIds: [] },
];

function renderLibrary(props = {}) {
  return render(
    <PlaylistProvider initialPlaylists={mockPlaylists}>
      <LibraryPage {...props} />
    </PlaylistProvider>
  );
}

describe('LibraryPage component', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
    useFavoritesStore.setState({ ids: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị tiêu đề và số lượng bài hát mặc định là 10000', () => {
    renderLibrary();
    expect(screen.getByText('Thư viện bài hát')).toBeInTheDocument();
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('lọc danh sách bài hát sau khi gõ tìm kiếm và chờ debounce 300ms', () => {
    vi.useFakeTimers();
    renderLibrary();

    const searchInput = screen.getByRole('textbox', { name: /tìm kiếm/i });
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    // Lúc vừa gõ xong (chưa qua 300ms), danh sách chưa lọc
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    // Chờ qua 300ms debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('lọc theo thể loại Rock kết hợp từ khóa tìm kiếm', () => {
    vi.useFakeTimers();
    renderLibrary();

    const searchInput = screen.getByRole('textbox', { name: /tìm kiếm/i });
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const genreSelect = screen.getByRole('combobox', { name: /thể loại/i });
    fireEvent.change(genreSelect, { target: { value: 'Rock' } });

    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('hiển thị thông báo "Không tìm thấy bài hát nào" khi từ khóa không khớp', () => {
    vi.useFakeTimers();
    renderLibrary();

    const searchInput = screen.getByRole('textbox', { name: /tìm kiếm/i });
    fireEvent.change(searchInput, { target: { value: 'xyz123khongco' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(
      screen.getAllByText('Không tìm thấy bài hát nào').length
    ).toBeGreaterThan(0);
  });

  it('thay đổi lựa chọn sắp xếp bài hát', () => {
    renderLibrary();

    const sortSelect = screen.getByRole('combobox', { name: /sắp xếp/i });
    fireEvent.change(sortSelect, { target: { value: 'name-asc' } });

    expect(sortSelect).toHaveValue('name-asc');
  });
});
