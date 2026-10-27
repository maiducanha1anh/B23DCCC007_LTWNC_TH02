import { describe, it, expect } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist, PlaylistAction } from './playlistReducer';

describe('playlistReducer', () => {
  it('tạo playlist mới với danh sách bài hát rỗng', () => {
    const initialState: Playlist[] = [];
    const action: PlaylistAction = {
      type: 'create',
      payload: { name: 'Chạy bộ' },
    };

    const nextState = playlistReducer(initialState, action);
    expect(nextState).toHaveLength(1);
    expect(nextState[0].name).toBe('Chạy bộ');
    expect(nextState[0].songIds).toEqual([]);
    expect(nextState[0].id).toBeDefined();
  });

  it('addSong thêm bài hát vào playlist và không thêm trùng bài', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Yêu thích', songIds: ['s1'] },
    ];

    // Thêm bài hát mới s2
    const addAction1: PlaylistAction = {
      type: 'addSong',
      payload: { playlistId: 'pl_1', songId: 's2' },
    };
    const stateWithTwo = playlistReducer(initialState, addAction1);
    expect(stateWithTwo[0].songIds).toEqual(['s1', 's2']);

    // Thêm lại bài s1 đã tồn tại -> không thêm trùng bài
    const addDuplicateAction: PlaylistAction = {
      type: 'addSong',
      payload: { playlistId: 'pl_1', songId: 's1' },
    };
    const stateDuplicate = playlistReducer(stateWithTwo, addDuplicateAction);
    expect(stateDuplicate[0].songIds).toEqual(['s1', 's2']);
  });

  it('removeSong xóa bài hát khỏi playlist', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Nhạc trẻ', songIds: ['s1', 's2', 's3'] },
    ];

    const removeSongAction: PlaylistAction = {
      type: 'removeSong',
      payload: { playlistId: 'pl_1', songId: 's2' },
    };

    const nextState = playlistReducer(initialState, removeSongAction);
    expect(nextState[0].songIds).toEqual(['s1', 's3']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Chill ban đêm', songIds: ['s1'] },
    ];

    const removeAction: PlaylistAction = {
      type: 'remove',
      payload: { id: 'pl_non_existent' },
    };

    const nextState = playlistReducer(initialState, removeAction);
    expect(nextState).toEqual(initialState);
  });
});
