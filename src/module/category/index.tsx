import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import ListCollection from './ListCollection';
import SubCollection from './SubCollection';
const Stack = createStackNavigator();

const Category = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Stack.Screen name="ListCollection" component={ListCollection} />
            <Stack.Screen name="SubCollection" component={SubCollection} />
        </Stack.Navigator>
    );
};

export default Category;
