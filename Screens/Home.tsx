import { FeedProps } from 'App';
import Card from 'components/Card';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import useTheme from 'hooks/useTheme';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image, LayoutChangeEvent, RefreshControl,
  SafeAreaView,
  ScrollView, StyleSheet, Text, View
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import * as settings from 'settings/generator.json';
import Store from 'settings/store';

const H_MAX_HEIGHT = settings.header_size;
const H_MIN_HEIGHT = settings.header_collapsed_size;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

const Home: FC<FeedProps> = () => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const _onViewLayoutChange = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 32);
  }
  const { colors, statusbarColors } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<number>(0);
  const rssContent = Store.useState(({ feed }) => feed)

  useEffect(() => {
    let cancel = false;
    const fetchRssContent = async () => {
      setLoading(true);
      const rss = await rssParser.parse(await (await fetch(settings.rss_url)).text())
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

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp"
  });

  return (
    <SafeAreaView
      onLayout={_onViewLayoutChange}
      style={{
        ...styles.container,
        backgroundColor: colors.background
      }}
    >
      <StatusBar
        style={statusbarColors.style}
        backgroundColor={statusbarColors.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollOffsetY } } }
        ], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            progressViewOffset={ H_MAX_HEIGHT }
            refreshing={loading}
            colors={[colors.title]}
            progressBackgroundColor={colors.background}
            onRefresh={handleOnRefresh}
          />
        }
        >
        <View style={{ paddingTop: H_MAX_HEIGHT }} />
        {rssContent?.items.map(item => <Card width={containerWidth} key={item.id} item={item} />)}
      </ScrollView>
      <Animated.View
        style={{
          ...styles.animated,
          height: headerScrollHeight,
          backgroundColor: colors.background
        }}
        >
        {rssContent?.image.url &&
          <Image
            source={{ uri: rssContent.image.url }}
            style={styles.image}
            accessibilityLabel={rssContent.image.title}
            resizeMode={"contain"}
          />
        }
        <Text style={{...styles.header1Title, color: colors.title}} >
          {rssContent?.title}
        </Text>
        {!!rssContent?.copyright &&
          <Text style={{ color: colors.title, textAlign: 'center' }}>{rssContent.copyright}</Text>
        }
      </Animated.View>
    </SafeAreaView>
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
  scrollViewContainer: {
    alignItems: 'stretch',
  },
  header1Title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 24,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    flex: 1,
  },
  animated: {
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
    top: Constants.statusBarHeight,
    width: "100%",
    overflow: "hidden",
    zIndex: 10,
    padding: 10,
    elevation: 2,
  }
});

export default Home;
