import { t, color } from '../';

jest.mock('react-native', () => ({
  StyleSheet: {
    // Mock StyleSheet by returning input object
    create: (obj) => obj,
  }
}));

test('default tailwind styles', () => {
  expect(t).toMatchSnapshot();
});

test('default colors', () => {
  expect(color).toMatchSnapshot();
});