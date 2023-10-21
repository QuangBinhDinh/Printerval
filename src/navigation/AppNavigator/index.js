import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import {
    Apps,
    AppsFill,
    Bell,
    BellFill,
    Home,
    HomeFill,
    User,
    UserFill,
    Search,
    Heart,
    SearchFill,
    HeartFill,
} from '@svg/index';
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
                }}
                name="CategoryScreen"
                component={EmptyScreen}
            />
            <Tab.Screen
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <SearchFill width={24} height={24} />;
                        else return <Search width={24} height={24} />;
                    },
                }}
                name="CartScreen"
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
                component={EmptyScreen}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
