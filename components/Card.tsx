

import { useNavigation, useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import * as rssParser from 'react-native-rss-parser';
import Store from 'settings/store';
import AutoHeightImage from 'vendor/AutoHeightImage';
import { DetailsProps } from '../App';
import AudioPlayer from './AudioPlayer';

interface Props {
  item?: rssParser.Item
  itemId?: string
  width: number
}

const Card: FC<Props> = ({ item: it, itemId, width }) => {
  const item = it ? it : Store.useState(({ feed }) => feed?.items.find(it => it.id === itemId));

  const navigation = useNavigation<DetailsProps['navigation']>()
  const handleOnCardClick = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Details', {
      itemId,
    });
  }
  const { colors } = useTheme();
  const image = item?.imageUrl || item?.itunes.image;

  const renderCardContent = () => (
    <>
      {image &&
        <AutoHeightImage
          width={width - 32 || 100}
          source={{ uri: image }}
          style={styles.image}
        />
      }
      <Text style={{...styles.header2Title, color: colors.text }}>{item?.title}</Text>
      {itemId &&
        <>
          <RenderHtml
            contentWidth={width}
            source={{
              html: item?.content ? item.content : item?.description || ''

            }}
            baseStyle={{ color: colors.text, backgroundColor: 'transparent' }}
            enableCSSInlineProcessing={false}
          />
          {(item?.enclosures && item.enclosures.length) &&
            item.enclosures.map(enclosure => {
              return (<AudioPlayer key={enclosure.url} uri={enclosure.url} />);
            })
          }
        </>
      }
      {(item?.authors && item.authors.length !== 0) &&
        <Text style={{ color: colors.text }}>By {item.authors.map(a => a.name).join(',')}</Text>
      }
      {item?.published &&
        <Text style={{ color: colors.text }}>{new Date(item.published).toLocaleString()}</Text>
      }
      {item?.categories &&
        <View style={styles.badges}>
          {item.categories.map((category, id) => <Text style={{ ...styles.badge, borderColor: colors.primary }} key={`${id}${category.name}`}>{category.name}</Text>)}
        </View>
      }
    </>
  );

  if (itemId) {
    return (
      <View
        style={{...styles.card, backgroundColor: colors.card }}
      >
        {renderCardContent()}
      </View>
    );
  }

  return (
    <TouchableOpacity
      delayPressIn={ 50 }
      activeOpacity={1}
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
  image: {
    borderRadius: 8
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1
  },
  badge: {
    fontSize: 9,
    padding: 2,
    paddingHorizontal: 4,
    margin: 2,
    borderWidth: 1,
    borderRadius: 16,
  }
});

export default Card;
