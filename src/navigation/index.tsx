import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import DetailScreen from '../module/test/DetailScreen';
import CartScreen from '../module/cart';
import SearchResult from '../module/searchResult/index';
import { TransitionPresets } from '@react-navigation/stack';
import { ColorValue, StatusBar, StatusBarStyle } from 'react-native';
import { SCREEN_WITH_COLOR } from '@constant/index';
import FilterScreen from '@searchResult/filterScreen';
import ProductCategory from '@searchResult/ProductCategory';
import { useFirstOpen } from './hooks/useFirstOpen';
import LoginScreen from '@auth/LoginScreen';
import CreateAccount from '@auth/CreateAccount';

const Stack = createSharedElementStackNavigator();

const Router = () => {
    const [barColor, setBarColor] = useState<StatusBarStyle>('dark-content');
    const [barBg, setBarBg] = useState<ColorValue>('white');
    const onNavigationReady = () => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';

        //thay đổi màu status bar khi navigate đến những màn có bg có màu
        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
            setBarBg('#000');
        } else {
            setBarColor('dark-content');
            setBarBg('#fff');
        }
    };

    const onNavigationStateChange = () => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';

        console.log(currentScreen);
        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
            setBarBg('#000');
        } else {
            setBarColor('dark-content');
            setBarBg('#fff');
        }
    };

    useFirstOpen();
    return (
        <NavigationContainer ref={navigationRef} onReady={onNavigationReady} onStateChange={onNavigationStateChange}>
            <StatusBar barStyle={barColor} translucent backgroundColor={'transparent'} />
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
                <Stack.Screen name="ProductCategory" component={ProductCategory} />
                <Stack.Screen name="FilterScreen" component={FilterScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
