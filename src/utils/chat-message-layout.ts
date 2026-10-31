import moment from 'moment';

export type LayoutMessage = {
  thread_id?: string;
  user_id?: string;
  created_at?: string;
};

export type SenderAvatarSlot = 'avatar' | 'spacer';

const isSameDay = (a?: string, b?: string) =>
  moment(a).format('YYYY-MM-DD') === moment(b).format('YYYY-MM-DD');

/**
 * Messages are ordered newest first (inverted list). A sender run ends at the
 * newest message of consecutive same-sender messages on the same day; only that
 * message shows the avatar, the rest keep an empty spacer for alignment.
 */
export const getSenderAvatarSlot = (
  messages: LayoutMessage[],
  index: number,
): SenderAvatarSlot => {
  const current = messages[index];
  const newer = messages[index - 1];

  if (!current || !newer) {
    return 'avatar';
  }

  const sameRun =
    String(newer.user_id) === String(current.user_id) &&
    isSameDay(newer.created_at, current.created_at);

  return sameRun ? 'spacer' : 'avatar';
};
