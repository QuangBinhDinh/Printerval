import React from 'react';
import HeaderScreen from '@components/HeaderScreen';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { StyleSheet, View } from 'react-native';
import AddressFill from './screen/AddressFill';
import { CheckoutFinish, CheckoutMap, CheckoutMapActive, CheckoutPayment, CheckoutPaymentActive } from '@assets/svg';
import { useAppSelector } from '@store/hook';
import CheckoutPreview from './screen/CheckoutPreview';
import PaymentMethod from './screen/PaymentMethod';
import { navigationRef } from '@navigation/service';

const Stack = createStackNavigator();

const CheckoutScreen = () => {
    const addressList = useAppSelector(state => state.auth.addressBook);
    const empty = addressList.length == 0;

    const screenName = navigationRef.getCurrentRoute()?.name;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Checkout" />
            <View style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.stepInner}>
                        <CheckoutMapActive width={24} height={24} />
                        <View style={styles.lineView}>
                            {[1, 2, 3, 4, 5].map(item => (
                                <View key={item} style={styles.dot} />
                            ))}
                        </View>
                        {screenName == 'PaymentMethod' ? (
                            <CheckoutPaymentActive width={24} height={24} />
                        ) : (
                            <CheckoutPayment width={24} height={24} />
                        )}
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
                        {empty && <Stack.Screen name="AddressFill" component={AddressFill} />}
                        <Stack.Screen name="CheckoutPreview" component={CheckoutPreview} />
                        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
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
        height: 70,
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
