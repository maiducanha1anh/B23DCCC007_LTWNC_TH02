import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hoãn cập nhật giá trị trước 300ms và chỉ cập nhật sau khi đủ 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    // Cập nhật giá trị mới
    rerender({ value: 'mưa rào', delay: 300 });

    // Trước 300ms, giá trị vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('mưa');

    // Sau khi advance thêm 100ms (tổng 300ms), giá trị mới được cập nhật
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('mưa rào');
  });
});
