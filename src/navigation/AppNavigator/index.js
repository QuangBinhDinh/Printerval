import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import { Home, HomeFill, User, UserFill, Search, Heart, SearchFill, HeartFill } from '@svg/index';
import EmptyScreen from '../../module/test/EmptyScreen';
import HomeScreen from '@home/index';
import Login from '../../module/auth/LoginScreen';
import Category from '@category/index';
import UserScreen from '@user/index';

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
                        if (focused) return <HomeFill width={25} height={25} />;
                        else return <Home width={25} height={25} />;
                    },
                }}
                name="HomeScreen"
                component={HomeScreen}
            />

            <Tab.Screen
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <SearchFill width={24} height={24} />;
                        else return <Search width={24} height={24} />;
                    },
                    lazy: false,
                }}
                name="Category"
                component={Category}
            />
            <Tab.Screen
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <SearchFill width={24} height={24} />;
                        else return <Search width={24} height={24} />;
                    },
                }}
                name="Cart"
                component={EmptyScreen}
            />

            <Tab.Screen
                options={{
                    title: 'Wishlist',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <HeartFill width={24} height={24} />;
                        else return <Heart width={24} height={24} />;
                    },
                }}
                name="Notify"
                component={EmptyScreen}
            />

            <Tab.Screen
                options={{
                    title: 'You',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <UserFill width={27} height={24} />;
                        else return <User width={27} height={24} />;
                    },
                }}
                name="UserScreen"
                component={UserScreen}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
