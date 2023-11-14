import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { ColorValue, StatusBar, StatusBarStyle } from 'react-native';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import { SCREEN_WITH_COLOR } from '@constant/index';
import { useFirstOpen } from './hooks/useFirstOpen';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import qs from 'query-string';

import BottomTabs from './AppNavigator';
import DetailScreen from '../module/test/DetailScreen';
import CartScreen from '../module/cart';
import SearchResult from '../module/searchResult/index';
import FilterScreen from '@searchResult/filterScreen';
import ProductCategory from '@searchResult/ProductCategory';
import LoginScreen from '@auth/LoginScreen';
import CreateAccount from '@auth/CreateAccount';
import ForgotPass from '@auth/ForgotPass';
import EnterNewPass from '@auth/EnterNewPass';
import LoginError from '@auth/component/LoginError';
import DetailProduct from '@product/index';
import PopupSuccess from '@components/popup/PopupSuccess';
import StyleGuide from '@product/screen/StyleGuide';
import CreateReview from '@product/screen/CreateReview';
import PopupError from '@components/popup/PopupError';
import AllReview from '@product/screen/AllReview';
import ReportProduct from '@product/screen/ReportProduct';
import BottomMessage from '@components/popup/BottomMessage';
import BlogScreen from '@user/screen/BlogScreen';
import CreateTicket from '@product/screen/CreateTicket';

const Stack = createSharedElementStackNavigator();

const Router = () => {
    const [barColor, setBarColor] = useState<StatusBarStyle>('dark-content');
    const routeNameRef = useRef<string>();

    const onNavigationReady = () => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';
        routeNameRef.current = currentScreen;

        //thay đổi màu status bar khi navigate đến những màn có bg có màu
        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
        } else {
            setBarColor('dark-content');
        }
    };

    const onNavigationStateChange = async (state: any) => {
        const currentScreen = navigationRef?.getCurrentRoute()?.name ?? '';
        const params = state?.routes[state?.index]?.params;
        //config lại chỉ khi IS_PRODUCT = true
        await analytics().logScreenView({
            screen_name: currentScreen,
            screen_class: currentScreen,
        });
        crashlytics().log(`${currentScreen}?${qs.stringify(params || {})}`);

        if (routeNameRef.current == currentScreen) return; // nếu navigate đến chính màn đó
        routeNameRef.current = currentScreen;
        if (SCREEN_WITH_COLOR.includes(currentScreen)) {
            setBarColor('light-content');
        } else {
            setBarColor('dark-content');
        }
    };

    useFirstOpen();
    return (
        <NavigationContainer ref={navigationRef} onReady={onNavigationReady} onStateChange={onNavigationStateChange}>
            <StatusBar barStyle={barColor} translucent backgroundColor={'transparent'} />
            <LoginError />
            <PopupSuccess />
            <PopupError />
            <BottomMessage />
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
                <Stack.Screen name="ForgotPass" component={ForgotPass} />
                <Stack.Screen name="EnterNewPass" component={EnterNewPass} />

                <Stack.Screen name="DetailProduct" component={DetailProduct} />
                <Stack.Screen name="StyleGuide" component={StyleGuide} />
                <Stack.Screen name="CreateReview" component={CreateReview} />
                <Stack.Screen name="AllReview" component={AllReview} />
                <Stack.Screen name="ReportProduct" component={ReportProduct} />

                <Stack.Screen name="BlogScreen" component={BlogScreen} />
                <Stack.Screen name="CreateTicket" component={CreateTicket} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
