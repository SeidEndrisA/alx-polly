import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePollForm from '@/components/CreatePollForm';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('@/context/AuthProvider');

const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { id: 'poll-123' }, error: null }),
};

describe('CreatePollForm', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      supabase: {
        ...mockSupabase,
        from: jest.fn((table: string) => {
          if (table === 'polls') {
            return {
              insert: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: 'poll-123' }, error: null }),
            };
          }
          if (table === 'poll_options') {
            return {
              insert: jest.fn().mockResolvedValue({ error: null }),
            };
          }
          return mockSupabase;
        }),
      },
    });
  });

  it('renders the form with initial fields', () => {
    render(<CreatePollForm />);
    expect(screen.getByLabelText('Poll Question')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('+ Add Option')).toBeInTheDocument();
    expect(screen.getByText('Create Poll')).toBeInTheDocument();
  });

  it('allows adding and removing options', async () => {
    render(<CreatePollForm />);
    const addOptionButton = screen.getByText('+ Add Option');
    
    await userEvent.click(addOptionButton);
    expect(screen.getByPlaceholderText('Option 3')).toBeInTheDocument();

    const removeButton = screen.getByLabelText('Remove option 3');
    await userEvent.click(removeButton);

    expect(screen.queryByPlaceholderText('Option 3')).not.toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CreatePollForm />);
    const createPollButton = screen.getByText('Create Poll');
    
    await userEvent.click(createPollButton);

    await waitFor(() => {
      expect(screen.getByText('Question is required.')).toBeInTheDocument();
      expect(screen.getAllByText('Option cannot be empty.')).toHaveLength(2);
    });
  });

  it('submits the form successfully', async () => {
    const { push } = useRouter();
    render(<CreatePollForm />);

    await userEvent.type(screen.getByLabelText('Poll Question'), 'What is your favorite color?');
    await userEvent.type(screen.getByPlaceholderText('Option 1'), 'Red');
    await userEvent.type(screen.getByPlaceholderText('Option 2'), 'Blue');

    const createPollButton = screen.getByText('Create Poll');
    await userEvent.click(createPollButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/polls/poll-123');
    });
  });
});