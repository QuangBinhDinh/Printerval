import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ListCollection from './ListCollection';

const Stack = createStackNavigator();

const Category = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ListCollection" component={ListCollection} />
        </Stack.Navigator>
    );
};

export default Category;
