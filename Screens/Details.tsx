import Card from 'components/Card';
import React, { FC, useState } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { DetailsProps } from '../App';

const Details: FC<DetailsProps> = ({ route }) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const _onViewLayoutChange = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 32);
  }
  const itemId = route.params.itemId;
  return (
    <ScrollView onLayout={_onViewLayoutChange}>
        <Card width={containerWidth} itemId={itemId} />
    </ScrollView>
  );
}

export default Details;
