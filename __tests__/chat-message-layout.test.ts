import {
  getSenderAvatarSlot,
  LayoutMessage,
} from '@/utils/chat-message-layout';

const ME = 'me';
const THEM = 'them';

// Messages are newest first, matching the inverted chat list.
const msg = (
  thread_id: string,
  user_id: string,
  created_at = '2026-10-12T10:00:00Z',
): LayoutMessage => ({ thread_id, user_id, created_at });

describe('getSenderAvatarSlot', () => {
  it('shows the avatar only on the newest message of a sender run', () => {
    const messages = [
      msg('m4', THEM),
      msg('m3', THEM),
      msg('m2', THEM),
      msg('m1', ME),
    ];

    expect(messages.map((_, i) => getSenderAvatarSlot(messages, i))).toEqual([
      'avatar',
      'spacer',
      'spacer',
      'avatar',
    ]);
  });

  it('gives every message an avatar when senders alternate', () => {
    const messages = [msg('m3', ME), msg('m2', THEM), msg('m1', ME)];

    expect(messages.map((_, i) => getSenderAvatarSlot(messages, i))).toEqual([
      'avatar',
      'avatar',
      'avatar',
    ]);
  });

  it('shows the avatar on a single message', () => {
    expect(getSenderAvatarSlot([msg('m1', ME)], 0)).toBe('avatar');
  });

  it('ends a run at a change of day', () => {
    const messages = [
      msg('m3', THEM, '2026-10-12T09:00:00'),
      msg('m2', THEM, '2026-10-11T22:00:00'),
      msg('m1', THEM, '2026-10-11T21:00:00'),
    ];

    expect(messages.map((_, i) => getSenderAvatarSlot(messages, i))).toEqual([
      'avatar',
      'avatar',
      'spacer',
    ]);
  });

  it('treats numeric and string user ids as the same sender', () => {
    const messages = [
      { thread_id: 'm2', user_id: '7' },
      { thread_id: 'm1', user_id: 7 as unknown as string },
    ];

    expect(getSenderAvatarSlot(messages, 1)).toBe('spacer');
  });
});
