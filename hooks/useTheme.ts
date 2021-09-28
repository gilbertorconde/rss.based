import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import store from '../store';

export default () => {
  switch(store.useState(s => s.isDarkMode)) {
    case('auto'):
      return useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    case('dark'):
      return DarkTheme;
    default:
      return DefaultTheme
  }
}
