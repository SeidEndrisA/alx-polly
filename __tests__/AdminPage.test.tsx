import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '@/app/admin/page';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('@/context/AuthProvider');

const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  update: jest.fn(),
};

describe('AdminPage', () => {
  it('redirects non-admin users', async () => {
    const { push } = useRouter();
    (useAuth as jest.Mock).mockReturnValue({
      supabase: {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { role: 'user' }, error: null }),
            }),
          }),
        }),
      },
      user: { id: '123' },
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/polls');
    });
  });

  it('displays the admin dashboard for admin users', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      supabase: {
        from: jest.fn((table: string) => {
          if (table === 'profiles') {
            return {
              select: jest.fn().mockResolvedValue({ data: [{ id: '123', username: 'testuser', role: 'user' }], error: null }),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
            };
          }
          return mockSupabase;
        }),
      },
      user: { id: '456' },
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });
});