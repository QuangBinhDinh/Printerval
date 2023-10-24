import React from 'react';
import { Text, View } from 'react-native';

const EmptyScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#333' }}>This is a screen</Text>
        </View>
    );
};

export default EmptyScreen;
