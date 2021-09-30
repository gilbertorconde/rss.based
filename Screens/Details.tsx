import Card from 'components/Card';
import OpenURLButton from 'components/OpenURLButton';
import React, { FC, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import Store from 'settings/store';
import { DetailsProps } from '../App';

const Details: FC<DetailsProps> = ({ route }) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const _onViewLayoutChange = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 32);
  }
  const itemId = route.params.itemId;
  const item = Store.useState(({ feed }) => feed?.items.find(it => it.id === itemId));

  return (
    !!item ?
      <ScrollView onLayout={_onViewLayoutChange}>
          <Card width={containerWidth} item={item} detailedView />
          <View style={styles.actions}>
            {!!(item?.links?.length > 0) &&
              <OpenURLButton url={item.links[0].url}>Read More</OpenURLButton>
            }
          </View>
      </ScrollView>
      :
      null

  );
}

const styles = StyleSheet.create({
  actions: {
    margin: 16,
  }
});

export default Details;
