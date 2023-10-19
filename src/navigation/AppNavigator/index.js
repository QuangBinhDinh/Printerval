import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import { Apps, AppsFill, Bell, BellFill, Home, HomeFill, User, UserFill } from '@svg/index';
import EmptyScreen from '../../moudle/test/EmptyScreen';
import HomeScreen from '../../moudle/home';
import ProductListScreen from '../../moudle/productList';
import Login from '../../moudle/auth';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                lazy: false,
            }}
            tabBar={props => <CustomTabBar {...props} />}
            initialRouteName="HomeScreen"
        >
            <Tab.Screen
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <HomeFill width={18} height={18} />;
                        else return <Home width={18} height={18} />;
                    },
                }}
                name="HomeScreen"
                component={HomeScreen}
            />

            <Tab.Screen
                options={{
                    title: 'Category',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <AppsFill width={18} height={18} />;
                        else return <Apps width={18} height={18} />;
                    },
                }}
                name="CategoryScreen"
                component={ProductListScreen}
            />

            <Tab.Screen
                options={{
                    title: 'Updates',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <BellFill width={18} height={18} />;
                        else return <Bell width={18} height={18} />;
                    },
                }}
                name="Notify"
                component={EmptyScreen}
            />

            <Tab.Screen
                options={{
                    title: 'You',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <UserFill width={18} height={18} />;
                        else return <User width={18} height={18} />;
                    },
                }}
                name="UserScreen"
                component={Login}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
