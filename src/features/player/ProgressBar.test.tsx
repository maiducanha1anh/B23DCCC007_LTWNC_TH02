import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';
import type { Song } from '../../types';

describe('ProgressBar component', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Bài hát mẫu',
    artist: 'Nghệ sĩ',
    genre: 'Pop',
    duration: 150, // 2:30
  };

  beforeEach(() => {
    usePlayerStore.setState({
      queue: [mockSong],
      currentIndex: 0,
      isPlaying: false,
      position: 0,
    });
  });

  it('hiển thị chính xác thời gian dạng 0:00 / 2:30', () => {
    render(<ProgressBar />);
    expect(screen.getByText('0:00 / 2:30')).toBeInTheDocument();
  });

  it('cập nhật định dạng thời gian và độ rộng tiến trình khi vị trí thay đổi', () => {
    usePlayerStore.setState({ position: 75 }); // 50%
    render(<ProgressBar />);

    expect(screen.getByText('1:15 / 2:30')).toBeInTheDocument();
    const progressFill = document.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });
});
