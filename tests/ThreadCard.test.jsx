import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ThreadCard from '../src/components/ThreadList/ThreadCard';

const thread = {
  _id: 't-test',
  title: 'Testing React components',
  content: 'This thread explains how to test a React component.',
  author: 'u1',
  subredditName: 'react',
  upvotedBy: ['u2', 'u3'],
  downvotedBy: ['u4'],
};

describe('ThreadCard', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the thread content and derived metadata', () => {
    render(<ThreadCard thread={thread} onSelect={onSelect} />);

    expect(
      screen.getByRole('heading', { name: thread.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(thread.content)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('r/react')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /back to home/i }),
    ).not.toBeInTheDocument();
  });

  it('passes the selected thread to onSelect when the card is clicked', async () => {
    const user = userEvent.setup();
    render(<ThreadCard thread={thread} onSelect={onSelect} />);

    await user.click(screen.getByRole('heading', { name: thread.title }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(thread);
  });

  it('renders and invokes the optional back action without selecting the thread', async () => {
    const user = userEvent.setup();
    const goBack = vi.fn();
    render(<ThreadCard thread={thread} onSelect={onSelect} goBack={goBack} />);

    const backButton = screen.getByRole('button', { name: /back to home/i });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);

    expect(goBack).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('handles upvote and downvote interactions without selecting the thread', async () => {
    const user = userEvent.setup();
    render(<ThreadCard thread={thread} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Upvote' }));
    await user.click(screen.getByRole('button', { name: 'Downvote' }));

    expect(window.alert).toHaveBeenNthCalledWith(1, 'Upvote clicked!');
    expect(window.alert).toHaveBeenNthCalledWith(2, 'Downvote clicked!');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
