import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useAppSelector } from '@store/hook';
import { capitalize } from 'lodash';
import FancyButton from '@components/FancyButton';
import { formatPrice } from '@util/index';
import PaymentOption from './PaymentOption';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderBody } from '@checkout/type';
import { BillingAddress } from '@type/common';
import { useCreateOrderMutation } from '@auth/service';
import { alertError } from '@components/popup/PopupError';
import { getErrorMessage } from '@api/service';
import PaypalWebview, { openPaypal } from '../PaypalWebview';
import { IS_PRODUCT } from '../../../../App';
import { StripeProvider, confirmPayment } from '@stripe/stripe-react-native';
import { Details } from '@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput';
import { navigate } from '@navigation/service';
import { showMessage } from '@components/popup/BottomMessage';

const PaymentMethod = () => {
    const insets = useSafeAreaInsets();

    const [postOrder] = useCreateOrderMutation();

    const [orderPressed, setPress] = useState(false);

    const [payMethod, setPayment] = useState<'stripe' | 'paypal'>('stripe');

    //thông tin thẻ thanh toán
    const [cardDetail, setCard] = useState<Details | null>(null);
    const validCardNumber = useMemo(() => {
        let isValid = true;
        //show lỗi khi đã nhấn nút thanh toán
        if (orderPressed) {
            if (!cardDetail) isValid = false;
            else {
                const { complete, validCVC, validExpiryDate, validNumber } = cardDetail;
                if (!complete) isValid = false;
                else if (validNumber != 'Valid' || validCVC != 'Valid' || validExpiryDate != 'Valid') {
                    isValid = false;
                }
            }
        }
        return isValid;
    }, [cardDetail, orderPressed]);

    //Loading payment
    const [processing, setProcessing] = useState(false);

    //Order code của thanh toán này
    const [orderCode, setOrderCode] = useState('');

    const { token } = useAppSelector(state => state.auth);
    const { cart_sub_total, shippingFee, paymentConfig, promotion, tipsAmount, additionalInfo, billAddress, giftInfo } =
        useAppSelector(state => state.cart);
    const shipAddress = useAppSelector(state => state.cart.defaultAddress);
    const { stripe_fee_percent, paypal_fee_percent, public_key, test_public_key } = paymentConfig;

    //key thanh toán qua stripe
    const stripe_key = IS_PRODUCT ? public_key : test_public_key;

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

    const IWillHaveOrder = async () => {
        setPress(true);
        console.log(cardDetail);
        if (!shipAddress) return;
        if (payMethod == 'stripe' && !validCardNumber) {
            return;
        }

        const isGift = !!giftInfo.name && !!giftInfo.phone;
        var buildData: OrderBody = {
            name: shipAddress.full_name,
            phone: shipAddress.phone,
            email: additionalInfo?.email,
            country: shipAddress.country_id || '',
            province: shipAddress.province_id || '',
            city_name: shipAddress.city_name,
            state_name: shipAddress.country?.name || '',
            address: shipAddress.address,
            optional_address: shipAddress.optional_address,
            zipcode: shipAddress.zip_code,
            payment_type: payMethod,
            promotion_code: promotion.promotion_code,
            discount: promotion.discount,
            tips: tips_fee,
            billingAddress: '',
            shippingConfiguration: '',
            currency_config: null,
            delivery_note: additionalInfo?.delivery_note,
            token_user_query: token,
            checkout_source: 'app',
            ...(isGift && { giftInfo: JSON.stringify(giftInfo) }),
        };

        let new_bill_address: BillingAddress = {
            name: shipAddress.full_name,
            address: shipAddress.address,
            country: shipAddress.country_id || '',
            country_name: shipAddress.country?.name || '',
            state_name: shipAddress.province?.name || '',
            city_name: shipAddress.city_name,
            zip_code: shipAddress.zip_code,
            optional_address: shipAddress.optional_address,
        };
        if (billAddress) {
            new_bill_address = { ...billAddress };
        }
        buildData.billingAddress = JSON.stringify(new_bill_address);

        setProcessing(true);
        try {
            const { redirect, order } = await postOrder(buildData).unwrap();
            setOrderCode(order.code);

            if (typeof redirect == 'string') {
                //luồng paypal
                openPaypal(redirect);
            } else {
                //luồng stripe
                const { error, paymentIntent } = await confirmPayment(redirect.payment_intent, {
                    paymentMethodType: 'Card',
                });
                if (error) {
                    //console.log('Error stripe', error);
                    alertError(error.localizedMessage || 'Undefined error from stripe');
                } else if (paymentIntent) {
                    navigate('CheckoutSuccess', { orderCode: order.code });
                } else {
                    alertError('Fatal error occur');
                }
            }
        } catch (e) {
            alertError(getErrorMessage(e));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <StripeProvider publishableKey={stripe_key}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16 }}
                >
                    <TextSemiBold style={{ fontSize: 18, color: lightColor.black }}>Payment method</TextSemiBold>

                    <PaymentOption
                        payMethod={payMethod}
                        setPayment={setPayment}
                        cardError={!validCardNumber}
                        setCard={setCard}
                    />

                    <View style={{ marginTop: 24 }}>
                        <TextSemiBold style={{ fontSize: 18, color: '#444', marginBottom: 8 }}>
                            Order summary
                        </TextSemiBold>
                        <View style={styles.row}>
                            <TextNormal style={styles.textGray}>Subtotal</TextNormal>
                            <TextSemiBold style={{ color: '#444' }}>{formatPrice(cart_sub_total)}</TextSemiBold>
                        </View>
                        {promotion.discount > 0 && (
                            <View style={styles.row}>
                                <TextNormal style={styles.textGray}>Discount</TextNormal>
                                <TextSemiBold style={{ color: '#444' }}>
                                    -{formatPrice(promotion.discount)}
                                </TextSemiBold>
                            </View>
                        )}
                        <View style={styles.row}>
                            <TextNormal style={styles.textGray}>Shipping fee</TextNormal>
                            <TextSemiBold style={{ color: '#444' }}>{formatPrice(shippingFee)}</TextSemiBold>
                        </View>
                        <View style={styles.row}>
                            <TextNormal style={styles.textGray}>{`${capitalize(
                                payMethod,
                            )}'s Transaction fee`}</TextNormal>
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
                        {processing ? (
                            <ActivityIndicator color={'white'} size={'small'} />
                        ) : (
                            <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Place Order Now</TextSemiBold>
                        )}
                    </FancyButton>

                    <View style={{ height: 16 + insets.bottom / 2 }} />
                </ScrollView>

                <PaypalWebview orderCode={orderCode} />
            </View>
        </StripeProvider>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
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
