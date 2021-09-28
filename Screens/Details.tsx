import React, { FC } from 'react';
import { DetailsProps } from '../App';
import Card from '../components/Card';

const Details: FC<DetailsProps> = ({ route }) => {
  const itemId = route.params.itemId;
  return (
    <Card itemId={itemId} />
  );
}

export default Details;
