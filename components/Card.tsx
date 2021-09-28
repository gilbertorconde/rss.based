

import { useNavigation, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import * as rssParser from 'react-native-rss-parser';
import { DetailsProps } from '../App';
import Store from '../store';

interface Props {
  item?: rssParser.Item
  itemId?: string
}

const Card: FC<Props> = ({ item: it, itemId }) => {

  const item = it ? it : Store.useState(({ feed }) => feed?.items.find(it => it.id === itemId));

  const navigation = useNavigation<DetailsProps['navigation']>()
  const handleOnCardClick = (itemId: string) => {
    navigation.navigate('Details', {
      itemId,
    });
  }
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const image = item?.imageUrl || item?.itunes.image;

  const renderCardContent = () => (
    <>
      {image &&
        <Image
          style={styles.cardImage}
          source={{ uri: image }}
        />
      }
      <Text style={{...styles.header2Title, color: colors.text }}>{item?.title}</Text>
      <RenderHtml
        contentWidth={width}
        source={{
          html: (
            !!itemId ?
              (item?.content ? item.content : item?.description ) :
              (item?.description ? item.description : item?.content)
          ) || ''
        }}
        baseStyle={{ color: colors.text, backgroundColor: 'transparent' }}
        enableCSSInlineProcessing={false}
      />
    </>
  );

  if (itemId) {
    return (
      <ScrollView
        style={{...styles.card, backgroundColor: colors.card }}
      >
        {renderCardContent()}
      </ScrollView>
    );
  }

  return (
    <TouchableOpacity
      style={{...styles.card, backgroundColor: colors.card }}
      accessible
      accessibilityRole="link"
      onPress={() => item && handleOnCardClick(item.id)}
    >
      {renderCardContent()}
    </TouchableOpacity>
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

export default Card;
