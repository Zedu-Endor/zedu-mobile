import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { UserAvatar } from '@/screens/channels/user-avatar';

jest.mock('@/theme/ThemeProvider', () => ({
  useTheme: () => ({ colors: {} }),
}));
jest.mock('@/theme/createStep10Styles', () => ({
  createChannelSetupStyles: () => new Proxy({}, { get: () => ({}) }),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('react-native-fast-image', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  const FastImage = (props: any) => mockReact.createElement(View, props);
  FastImage.resizeMode = { cover: 'cover', contain: 'contain' };
  return { __esModule: true, default: FastImage };
});

const labelFor = (props: React.ComponentProps<typeof UserAvatar>) => {
  let tree: renderer.ReactTestRenderer | undefined;
  act(() => {
    tree = renderer.create(<UserAvatar {...props} />);
  });
  return tree!.root.findByType(TouchableOpacity).props.accessibilityLabel;
};

describe('UserAvatar presence label', () => {
  it('says the status in words, not only by colour', () => {
    expect(
      labelFor({ user: { online: true }, fallbackName: 'ada', disabled: true }),
    ).toBe('ada, Online');
    expect(
      labelFor({
        user: { online: false },
        fallbackName: 'ada',
        disabled: true,
      }),
    ).toBe('ada, Offline');
  });

  it('leaves the status out when no dot is shown', () => {
    expect(
      labelFor({
        user: { online: true },
        fallbackName: 'ada',
        showBadge: false,
      }),
    ).toBe('ada');
  });
});
