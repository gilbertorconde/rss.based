

import { useTheme } from '@react-navigation/native';
import React from 'react';
import { GestureResponderEvent, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import * as rssParser from 'react-native-rss-parser';

interface Props {
  item: rssParser.Item
}

export default ({ item }: Props) => {
  const handleOnCardClick = (_e: GestureResponderEvent) => {
    console.log()
  }
  const { colors, dark } = useTheme();
  const { width } = useWindowDimensions();
  const image = item.imageUrl || item.itunes.image;
  return (
    <View style={{...styles.card, backgroundColor: colors.card }} accessible accessibilityRole="link" onTouchEnd={handleOnCardClick} >
      {image &&
        <Image
          style={styles.cardImage}
          source={{ uri: image }}
        />
      }
      <Text style={{...styles.header2Title, color: colors.text }}>{item.title}</Text>
      <RenderHtml
        contentWidth={width}
        source={{html: item.description}}
        baseStyle={{ color: colors.text, backgroundColor: 'transparent' }}
        enableCSSInlineProcessing={false}
      />
    </View>
  );

}


const styles = StyleSheet.create({
  header2Title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    textAlign: 'left',
  },
  card: {
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardImage: {
    width: 150,
    height: 150,
  }
});