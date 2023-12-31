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
import ModalOption from '@components/input/ModalOption';
import AddressBook from '@user/screen/AddressBook';
import CheckoutScreen from '@checkout/index';
import EditShipping from '@checkout/screen/EditAddress/EditShipping';
import EditBilling from '@checkout/screen/EditAddress/EditBilling';
import CreateAddress from '@user/screen/AddressBook/CreateAddress';
import ListOrderScreen from '@user/screen/ListOrder';
import OrderDetail from '@user/screen/OrderDetail';
import LandingPage from '@home/screen/LandingPage';
import NotFoundScreen from '../module/utility/NotFoundScreen';
import WishlistScreen from '@user/screen/Wishlist';
import ProfileSettings from '@user/screen/ProfileSettings';
import OrderTracking from '@user/screen/OrderTracking';
import FAQ from '@user/screen/FAQ';
import SellerPage from '@product/screen/SellerPage';
import NotficationScreen from '@notification/index';
import IntroScreen from '@intro/index';
import SelectSizeGuide from '@guide/SelectSize';
import SizeGuideResult from '@guide/SizeGuideResult';

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
            <ModalOption />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            >
                <Stack.Screen name="Intro" component={IntroScreen} options={{ animationEnabled: false }} />
                <Stack.Screen name="App" component={BottomTabs} options={{ animationEnabled: false }} />

                <Stack.Screen name="LandingPage" component={LandingPage} />
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
                <Stack.Screen name="CreateTicket" component={CreateTicket} />
                <Stack.Screen name="SellerPage" component={SellerPage} />

                <Stack.Screen name="CheckoutNavigator" component={CheckoutScreen} />
                <Stack.Screen name="EditShipAddress" component={EditShipping} />
                <Stack.Screen name="EditBillAddress" component={EditBilling} />

                <Stack.Screen name="BlogScreen" component={BlogScreen} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
                <Stack.Screen name="AddressBook" component={AddressBook} />
                <Stack.Screen name="CreateAddress" component={CreateAddress} />
                <Stack.Screen name="ListOrderScreen" component={ListOrderScreen} />
                <Stack.Screen name="OrderDetail" component={OrderDetail} />
                <Stack.Screen name="OrderTracking" component={OrderTracking} />
                <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
                <Stack.Screen name="FAQScreen" component={FAQ} />

                <Stack.Screen name="NotficationScreen" component={NotficationScreen} />
                <Stack.Screen name="SelectSizeGuide" component={SelectSizeGuide} />
                <Stack.Screen name="SizeGuideResult" component={SizeGuideResult} />

                <Stack.Screen name="NotFoundScreen" component={NotFoundScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
