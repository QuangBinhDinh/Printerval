import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { shadow } from '@styles/shadow';
import { useAppSelector } from '@store/hook';
import { capitalize } from 'lodash';
import FancyButton from '@components/FancyButton';
import { formatPrice } from '@util/index';
import PaymentOption from './PaymentOption';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '@navigation/service';

const PaymentMethod = () => {
    const insets = useSafeAreaInsets();

    const [payMethod, setPayment] = useState<'stripe' | 'paypal'>('stripe');
    const { cart_sub_total, shippingFee, paymentConfig, promotion, tipsAmount } = useAppSelector(state => state.cart);
    const { stripe_fee_percent, paypal_fee_percent } = paymentConfig;

    //phí giao dịch qua cổng thanh toán
    const transaction_fee = useMemo(() => {
        let multiplier = 0;
        if (payMethod == 'stripe') {
            multiplier = stripe_fee_percent;
        } else if (payMethod == 'paypal') {
            multiplier = paypal_fee_percent;
        }

        var final = multiplier * (cart_sub_total + shippingFee - promotion.discount);
        return Math.ceil(final * 100) / 100;
    }, [payMethod]);

    //tiền tip user
    const tips_fee = useMemo(() => {
        var totalBefore = cart_sub_total + shippingFee - promotion.discount + transaction_fee;
        let tips = 0;

        //2 loại tips: percent và cộng thẳng
        if (tipsAmount.isPercent) {
            tips = Math.round(totalBefore * tipsAmount.amount);
        } else {
            tips = tipsAmount.amount;
        }
        return tips;
    }, [transaction_fee, tipsAmount]);

    const total = cart_sub_total + shippingFee - promotion.discount + transaction_fee + tips_fee;

    const IWillHaveOrder = () => {
        navigate('CheckoutSuccess');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16 }}
            >
                <TextSemiBold style={{ fontSize: 18, color: lightColor.black }}>Payment method</TextSemiBold>

                <PaymentOption payMethod={payMethod} setPayment={setPayment} />

                <View style={{ marginTop: 24 }}>
                    <TextSemiBold style={{ fontSize: 18, color: '#444', marginBottom: 8 }}>Order summary</TextSemiBold>
                    <View style={styles.row}>
                        <TextNormal style={styles.textGray}>Subtotal</TextNormal>
                        <TextSemiBold style={{ color: '#444' }}>{formatPrice(cart_sub_total)}</TextSemiBold>
                    </View>
                    <View style={styles.row}>
                        <TextNormal style={styles.textGray}>Discount</TextNormal>
                        <TextSemiBold style={{ color: '#444' }}>-{formatPrice(promotion.discount)}</TextSemiBold>
                    </View>
                    <View style={styles.row}>
                        <TextNormal style={styles.textGray}>Shipping fee</TextNormal>
                        <TextSemiBold style={{ color: '#444' }}>{formatPrice(shippingFee)}</TextSemiBold>
                    </View>
                    <View style={styles.row}>
                        <TextNormal style={styles.textGray}>{`${capitalize(payMethod)}'s Transaction fee`}</TextNormal>
                        <TextSemiBold style={{ color: '#444' }}>{formatPrice(transaction_fee)}</TextSemiBold>
                    </View>
                    <View style={styles.row}>
                        <TextNormal style={styles.textGray}>Tips</TextNormal>
                        <TextSemiBold style={{ color: '#444' }}>{formatPrice(tips_fee)}</TextSemiBold>
                    </View>

                    <View style={[styles.row, { borderBottomWidth: 0 }]}>
                        <TextNormal>Total</TextNormal>
                        <TextSemiBold style={{ color: lightColor.price }}>{formatPrice(total)}</TextSemiBold>
                    </View>
                </View>

                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={IWillHaveOrder}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Continue</TextSemiBold>
                </FancyButton>

                <View style={{ height: 16 + insets.bottom / 2 }} />
            </ScrollView>
        </View>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
    optionView: {
        height: 68,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 24,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 64,
        height: 38,
        backgroundColor: 'white',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
        height: 48,
    },
    textGray: {
        fontSize: 15,
        color: lightColor.grayout,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
        marginTop: 50,
    },
});
