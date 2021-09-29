import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBarStyle } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as settings from 'settings/generator.json';
import store from 'settings/store';

interface RssTheme {
  dark: boolean,
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    title: string;
  }
  statusbarColors: {
    background?: string,
    style: StatusBarStyle
  }
}

export default (): RssTheme => {

  const RssLightTheme: RssTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      // @ts-ignore
      title: DefaultTheme.colors.text,
      ...settings.colors.light
    },
    statusbarColors: {
      // @ts-ignore
      style: 'dark',
      ...settings.colors.statusbar.light
    }
  };
  const RssDarkTheme: RssTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      // @ts-ignore
      title: DarkTheme.colors.text,
      ...settings.colors.dark
    },
    statusbarColors: {
      // @ts-ignore
      style: 'light',
      ...settings.colors.statusbar.dark
    }
  };

  switch(store.useState(s => s.isDarkMode)) {
    case('auto'):
      return useColorScheme() === 'dark' ? RssDarkTheme : RssLightTheme;
    case('dark'):
      return RssDarkTheme;
    default:
      return RssLightTheme
  }
}
