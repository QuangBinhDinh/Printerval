import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import DetailScreen from '../module/test/DetailScreen';
import EmptyScreen from '../module/test/EmptyScreen';
import CartScreen from '../module/cart';
import SearchResult from '../module/searchResult/index';
import { TransitionPresets } from '@react-navigation/stack';
const Stack = createSharedElementStackNavigator();

const Router = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            >
                <Stack.Screen name="App" component={BottomTabs} options={{ animationEnabled: false }} />
                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    options={{
                        cardStyleInterpolator: ({ current: { progress } }) => {
                            return { cardStyle: { opacity: progress } };
                        },
                    }}
                    sharedElements={route => {
                        const { url } = route.params;
                        return [url];
                    }}
                />
                <Stack.Screen name="CartNavigator" component={CartScreen} />
                <Stack.Screen name="SearchResult" component={SearchResult} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
