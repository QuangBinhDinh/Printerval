import React from 'react';
import HeaderScreen from '@components/HeaderScreen';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { StyleSheet, View } from 'react-native';
import AddressFill from './screen/AddressFill';
import { CheckoutFinish, CheckoutMap, CheckoutPayment } from '@assets/svg';

const Stack = createStackNavigator();

const CheckoutScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Checkout" />
            <View style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.stepInner}>
                        <CheckoutMap width={24} height={24} />
                        <View style={styles.lineView}>
                            {[1, 2, 3, 4, 5].map(item => (
                                <View key={item} style={styles.dot} />
                            ))}
                        </View>
                        <CheckoutPayment width={24} height={24} />
                        <View style={styles.lineView}>
                            {[1, 2, 3, 4, 5].map(item => (
                                <View key={item} style={styles.dot} />
                            ))}
                        </View>
                        <CheckoutFinish width={24} height={24} />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            ...TransitionPresets.SlideFromRightIOS,
                        }}
                    >
                        <Stack.Screen name="AddressFill" component={AddressFill} />
                    </Stack.Navigator>
                </View>
            </View>
        </View>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    stepContainer: {
        width: '100%',
        height: 76,
        justifyContent: 'center',
        alignItems: 'center',
    },

    stepInner: {
        //borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 280,
        height: 24,
    },
    icon: {
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '25%',
        justifyContent: 'space-between',
    },
    dot: {
        width: 2,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#999',
    },
});
