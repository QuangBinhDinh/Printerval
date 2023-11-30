import { CheckoutSuccess } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO, SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { shadowTop } from '@styles/shadow';
import { navigate } from '@navigation/service';
import { useFocus, usePreventGoBack } from '@navigation/customHook';
import { normalize } from '@rneui/themed';
import { useRoute } from '@react-navigation/native';
import { CheckoutSuccessRouteProp } from '@navigation/navigationRoute';
import { useAppDispatch } from '@store/hook';
import cart from '@cart/reducer';
import { api } from '@api/service';

const CheckoutSuccessScreen = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { params: { orderCode, orderEmail } = {} } = useRoute<CheckoutSuccessRouteProp>();

    const copyCode = () => {};

    const continueShopping = () => {
        navigate('HomeScreen');
    };

    const toTrackOrder = () => {
        navigate('OrderDetail', { orderCode, email: orderEmail, status: 'PENDING' });
    };

    useFocus(() => {
        dispatch(cart.actions.resetCartAfterCheckout());
    });

    usePreventGoBack();
    return (
        <View style={styles.container}>
            <CheckoutSuccess width={normalize(140)} height={normalize(160)} />

            <TextSemiBold style={styles.title}>Your delivery is on its way</TextSemiBold>

            <Pressable style={styles.orderCodeView} onPress={copyCode}>
                <TextSemiBold style={{ fontSize: 20, lineHeight: 24, color: lightColor.secondary, marginTop: 2 }}>
                    {orderCode || '#ORDERCODE'}
                </TextSemiBold>
            </Pressable>

            <TextNormal style={{ marginTop: normalize(24) }}>
                You can always track your order{' '}
                <TextNormal style={{ color: lightColor.secondary }} onPress={toTrackOrder}>
                    here
                </TextNormal>
            </TextNormal>

            <View
                style={[
                    styles.bottomView,
                    shadowTop,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={continueShopping}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Continue Shopping</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default CheckoutSuccessScreen;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: normalize(20), backgroundColor: 'white' },
    title: {
        fontSize: 20,
        lineHeight: 24,
        marginTop: normalize(40),
        color: '#444',
    },
    orderCodeView: {
        height: 56,
        width: 220,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        marginTop: normalize(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
