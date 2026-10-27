import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from './SongRow';
import type { Song } from '../../types';

describe('SongRow component', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150, // 150 giây = 2:30
  };

  it('hiển thị tên bài và thời lượng 2:30', () => {
    const handlePlay = vi.fn();
    render(
      <SongRow
        index={0}
        song={mockSong}
        onPlay={handlePlay}
      />
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', async () => {
    const handlePlay = vi.fn();
    const user = userEvent.setup();

    render(
      <SongRow
        index={0}
        song={mockSong}
        onPlay={handlePlay}
      />
    );

    const playButton = screen.getByRole('button', { name: 'Phát' });
    await user.click(playButton);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockSong);
  });
});
