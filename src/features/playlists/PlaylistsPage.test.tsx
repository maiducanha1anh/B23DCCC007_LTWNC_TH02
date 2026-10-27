import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlaylistsPage from './PlaylistsPage';
import { PlaylistProvider } from './PlaylistContext';
import type { ReactNode } from 'react';

function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <PlaylistProvider>{ui}</PlaylistProvider>
    </MemoryRouter>
  );
}

describe('PlaylistsPage component', () => {
  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createButton);

    expect(
      screen.getByText('Tên playlist không được để trống')
    ).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByRole('textbox', { name: /tên playlist/i });
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Nhạc học bài');
    await user.click(createButton);

    expect(screen.getByText('Nhạc học bài')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('báo lỗi khi tạo playlist trùng tên không phân biệt hoa thường', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByRole('textbox', { name: /tên playlist/i });
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();

    await user.type(input, 'chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });
});
