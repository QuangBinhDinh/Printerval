import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { shadow } from '@styles/shadow';
import { useAppSelector } from '@store/hook';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CheckoutPaymentActive, Maestro, Mastercard, PaypalLogo, StripeLogo, Visa } from '@assets/svg';
import { CardField } from '@stripe/stripe-react-native';
import { Details } from '@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput';

const DURATION = 250;

const STRIPE_HEIGHT = 215;

const PAYPAL_HEIGHT = 95;

interface IProps {
    /**
     * Phương thức thanh toán đc chọn
     */
    payMethod: string;

    setPayment: any;

    /**
     * Thông tin thẻ
     * @param x
     * @returns
     */
    setCard: (x: Details | null) => void;

    /**
     * Có hiển thị lỗi hay không
     */
    cardError: boolean;
}

const PaymentOption = ({ payMethod, setPayment, setCard, cardError }: IProps) => {
    const { stripe_fee_percent, paypal_fee_percent } = useAppSelector(state => state.cart.paymentConfig);

    const stripeHeight = useSharedValue(STRIPE_HEIGHT);
    const paypalHeight = useSharedValue(0);

    useEffect(() => {
        if (payMethod == 'stripe') {
            stripeHeight.value = withTiming(STRIPE_HEIGHT, { duration: DURATION });
            paypalHeight.value = withTiming(0, { duration: DURATION });
        } else if (payMethod == 'paypal') {
            stripeHeight.value = withTiming(0, { duration: DURATION });
            paypalHeight.value = withTiming(PAYPAL_HEIGHT, { duration: DURATION });
        }
    }, [payMethod]);

    const stripeStyle = useAnimatedStyle(() => ({
        height: stripeHeight.value,
    }));
    const paypalStyle = useAnimatedStyle(() => ({
        height: paypalHeight.value,
    }));

    const selectPaypal = () => {
        setPayment('paypal');
    };

    return (
        <View style={{ width: '100%' }}>
            <Pressable
                style={[
                    styles.optionView,
                    { marginTop: 16 },
                    payMethod == 'stripe' && [{ backgroundColor: 'white' }, shadow],
                ]}
                onPress={() => setPayment('stripe')}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.logo]}>
                        <CheckoutPaymentActive width={24} height={24} />
                    </View>
                    <TextNormal>Credit card</TextNormal>
                </View>
                <Icon
                    type="feather"
                    name={`chevron-${payMethod == 'stripe' ? 'down' : 'right'}`}
                    size={24}
                    color={lightColor.primary}
                />
            </Pressable>

            <Animated.View style={[styles.content, stripeStyle]}>
                <TextNormal style={styles.textTitle}>{stripe_fee_percent * 100}% Stripe's Transaction fee</TextNormal>
                <TextNormal style={styles.textDetail}>
                    Please be advised this is the fee you pay every time you process a transaction. This fee goes to the
                    payment gateway and we do not own it.
                </TextNormal>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                    <View style={styles.logoSmall}>
                        <Visa />
                    </View>
                    <View style={styles.logoSmall}>
                        <Mastercard />
                    </View>
                    <View style={styles.logoSmall}>
                        <Maestro />
                    </View>
                    <View style={styles.logoSmall}>
                        <StripeLogo />
                    </View>
                </View>

                <View style={{ width: '100%', marginTop: 8 }}>
                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={styles.cardStyle}
                        style={[styles.cardDetail, cardError && { borderColor: lightColor.error }]}
                        onCardChange={card => {
                            setCard(card);
                        }}
                    />
                </View>
                {cardError && payMethod == 'stripe' && (
                    <TextNormal style={styles.error}>Please enter a valid card</TextNormal>
                )}
            </Animated.View>

            <Pressable
                style={[styles.optionView, payMethod == 'paypal' && [{ backgroundColor: 'white' }, shadow]]}
                onPress={selectPaypal}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.logo}>
                        <PaypalLogo />
                    </View>
                    <TextNormal>Paypal</TextNormal>
                </View>
                <Icon
                    type="feather"
                    name={`chevron-${payMethod == 'paypal' ? 'down' : 'right'}`}
                    size={24}
                    style={{ marginTop: -2 }}
                    color={lightColor.primary}
                />
            </Pressable>
            <Animated.View style={[styles.content, paypalStyle]}>
                <TextNormal style={styles.textTitle}>
                    {(paypal_fee_percent * 100).toFixed(2)}% Paypal's Transaction fee
                </TextNormal>
                <TextNormal style={styles.textDetail}>
                    Please be advised this is the fee you pay every time you process a transaction. This fee goes to the
                    payment gateway and we do not own it.
                </TextNormal>
            </Animated.View>
        </View>
    );
};

export default memo(PaymentOption);

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
        borderWidth: 1,
        borderColor: 'white',
    },
    logoSmall: {
        width: 54,
        height: 36,
        backgroundColor: 'white',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        // borderWidth: 1,
        // borderColor: lightColor.borderGray,
    },
    cardDetail: {
        width: '100%',
        height: 50,
        marginTop: 10,
    },
    cardStyle: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        placeholderColor: '#dcdcdc',
        borderColor: lightColor.borderGray,
        borderWidth: 1,
        borderRadius: 6,
    },

    content: {
        width: '100%',
        overflow: 'hidden',
        //borderWidth: 1,
    },
    textTitle: {
        fontSize: 13,
        fontFamily: 'Poppins-Italic',
        color: lightColor.secondary,
        lineHeight: 16,
        marginTop: 16,
    },

    textDetail: {
        fontSize: 13,
        fontFamily: 'Poppins-Italic',
        color: lightColor.grayout,
        lineHeight: 16,
        marginTop: 8,
    },

    error: { fontSize: 11, lineHeight: 13, color: lightColor.error, marginTop: 4 },
});
