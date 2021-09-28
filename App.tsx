import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import useTheme from './hooks/useTheme';
import Details from './Screens/Details';
import Home from "./Screens/Home";

type RootStackParamList = {
  Feed: undefined;
  Details: { itemId: string };
};

export type FeedProps = NativeStackScreenProps<RootStackParamList, 'Feed'>;
export type DetailsProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

const Stack = createNativeStackNavigator();

export default () => {
  return (
    <NavigationContainer theme={useTheme()}>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen name="Feed" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

