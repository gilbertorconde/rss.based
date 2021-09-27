import { RSS_URL } from "@env";
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image, RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, useColorScheme
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import Card from "./components/Card";

export default () => {
  const [update, setUpdate] = useState<number>(0);
  const [rssContent, setRssContent] = useState<rssParser.Feed>();
  const [loading, setLoading] = useState<boolean>(false);
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    let cancel = false;
    const fetchRssContent = async () => {
      setLoading(true);
      const rss = await rssParser.parse(await (await fetch(RSS_URL)).text())
      if (!cancel) {
        setRssContent(rss);
        setLoading(false);
      }
    }
    fetchRssContent();
    return () => { cancel = true };
  }, [update]);

  const handleOnRefresh = () => {
    setUpdate(prev => prev + 1)
  }

  return (
    <NavigationContainer theme={theme}>
      <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleOnRefresh}
            />
          }
        >
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {rssContent?.image &&
            <Image
              style={styles.image}
              accessibilityLabel={rssContent.image.title}
              source={{ uri: rssContent.image.url }}
            />
          }
          <Text style={{...styles.header1Title, color: theme.colors.text}} >
            {rssContent?.title}
          </Text>
          {rssContent?.items.map((item) => <Card  key={item.id} item={item} />)}
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  header1Title: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 24,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
  }
});
