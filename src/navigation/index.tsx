import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import DetailScreen from '../moudle/test/DetailScreen';
const Stack = createSharedElementStackNavigator();

const Router = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    // cardStyleInterpolator: ({ current: { progress } }) => {
                    //     return { cardStyle: { opacity: progress } };
                    // },
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
                <Stack.Screen name="Detail2" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
