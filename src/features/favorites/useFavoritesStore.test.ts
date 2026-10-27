import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    localStorage.clear();
  });

  it('toggle thêm id bài hát khi chưa có trong danh sách', () => {
    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('toggle xóa id bài hát khi đã có trong danh sách yêu thích', () => {
    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toContain('s1');

    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).not.toContain('s1');
    expect(useFavoritesStore.getState().ids).toHaveLength(0);
  });

  it('có thể lưu nhiều bài hát yêu thích', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s2');
    useFavoritesStore.getState().toggle('s3');

    expect(useFavoritesStore.getState().ids).toEqual(['s1', 's2', 's3']);
  });
});
