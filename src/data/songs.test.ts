import { describe, it, expect } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('tạo ra đúng 10000 bài hát', () => {
    const songs = generateSongs(10000);
    expect(songs).toHaveLength(10000);
  });

  it('tất cả bài hát có id không bị trùng lặp', () => {
    const songs = generateSongs(10000);
    const idSet = new Set(songs.map((song) => song.id));
    expect(idSet.size).toBe(10000);
  });

  it('mọi bài hát đều có thời lượng từ 150 đến 300 giây', () => {
    const songs = generateSongs(10000);
    const allValidDuration = songs.every(
      (song) => song.duration >= 150 && song.duration <= 300
    );
    expect(allValidDuration).toBe(true);
  });

  it('khớp chính xác các bộ lọc mẫu trong đề bài', () => {
    const songs = generateSongs(10000);
    const mua = songs.filter(
      (s) =>
        s.title.toLowerCase().includes('mưa') ||
        s.artist.toLowerCase().includes('mưa')
    );
    expect(mua).toHaveLength(1250);

    const muaRock = mua.filter((s) => s.genre === 'Rock');
    expect(muaRock).toHaveLength(250);

    const thuHa = songs.filter(
      (s) =>
        s.title.toLowerCase().includes('thu hà') ||
        s.artist.toLowerCase().includes('thu hà')
    );
    expect(thuHa).toHaveLength(1000);

    const sorted = [...songs].sort((a, b) =>
      a.title.localeCompare(b.title, 'vi')
    );
    expect(sorted[0].title).toBe('Biển bình yên 1');
  });
});
