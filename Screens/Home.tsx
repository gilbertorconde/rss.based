import { RSS_URL } from '@env';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { FC, useEffect, useState } from 'react';
import {
  Image, RefreshControl,
  SafeAreaView,
  ScrollView, StyleSheet, Text
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { FeedProps } from '../App';
import Card from '../components/Card';
import Store from '../store';

const Home: FC<FeedProps> = () => {
  const { colors, dark } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<number>(0);
  const rssContent = Store.useState(({ feed }) => feed)

  useEffect(() => {
    let cancel = false;
    const fetchRssContent = async () => {
      setLoading(true);
      const rss = await rssParser.parse(await (await fetch(RSS_URL)).text())
      if (!cancel) {
        Store.update(s => { s.feed = rss; })
        setLoading(false);
      }
    }
    fetchRssContent();
    return () => { cancel = true };
  }, [update]);

  const handleOnRefresh = () => {
    setLoading(true);
    setUpdate(prev => prev + 1)
  }

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: colors.background }}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleOnRefresh}
          />
        }
      >
        <StatusBar style={dark ? 'light' : 'dark'} />
        {rssContent?.image.url &&
          <Image
            style={styles.image}
            accessibilityLabel={rssContent.image.title}
            source={{ uri: rssContent.image.url }}
          />
        }
        <Text style={{...styles.header1Title, color: colors.text}} >
          {rssContent?.title}
        </Text>
        {rssContent?.items.map((item) => <Card key={item.id} item={item} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  scrollViewContainer: {
    alignItems: 'center',
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

export default Home;
