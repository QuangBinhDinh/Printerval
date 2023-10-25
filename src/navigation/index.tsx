import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo, useState, useRef } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import DetailScreen from '../module/test/DetailScreen';
import EmptyScreen from '../module/test/EmptyScreen';
import CartScreen from '../module/cart';
import SearchResult from '../module/searchResult/index';
import { TransitionPresets } from '@react-navigation/stack';
import { ColorValue, StatusBar, StatusBarStyle } from 'react-native';
import { SCREEN_WITH_COLOR } from '@constant/index';
const Stack = createSharedElementStackNavigator();

const Router = () => {
    const [barColor, setBarColor] = useState<StatusBarStyle>('dark-content');
    const [barBg, setBarBg] = useState<ColorValue>('white');
    const onNavigationReady = () => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';

        //thay đổi màu status bar khi navigate đến những màn có bg có màu
        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
        } else setBarColor('dark-content');
    };

    const onNavigationStateChange = () => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';

        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
        } else setBarColor('dark-content');
    };
    return (
        <NavigationContainer ref={navigationRef} onReady={onNavigationReady} onStateChange={onNavigationStateChange}>
            <StatusBar barStyle={barColor} backgroundColor={barBg} />
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
