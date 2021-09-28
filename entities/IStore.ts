import * as rssParser from 'react-native-rss-parser';

type colorScheme = 'auto' | 'dark' | 'light'

export default interface IStore {
  isDarkMode: colorScheme,
  feed: rssParser.Feed | undefined
}
