
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /Modern Polling App/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
