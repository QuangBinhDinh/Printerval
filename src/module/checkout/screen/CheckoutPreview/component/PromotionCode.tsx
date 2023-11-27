import { CouponLogo } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputBold from '@components/input/InputBold';
import InputNormal from '@components/input/InputNormal';
import { normalize } from '@rneui/themed';
import Animated, {
    useSharedValue,
    interpolate,
    useAnimatedStyle,
    Extrapolation,
    withTiming,
} from 'react-native-reanimated';
import { usePostPromotionCodeMutation } from '@checkout/service';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { sumBy } from 'lodash';
import cart from '@cart/reducer';

const INPUT_HEIGHT = 44;

const PromotionCode = () => {
    const dispatch = useAppDispatch();
    const [postCode, { isLoading }] = usePostPromotionCodeMutation();
    const { cart_sub_total, items, defaultAddress, shippingConfigIndex, transfromShipping } = useAppSelector(
        state => state.cart,
    );

    const [isExpand, setExpand] = useState(false);

    const [text, setText] = useState('');
    const [codeStatus, setStatus] = useState({
        msg: '',
        status: 'none',
    });

    const transY = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({
        height: transY.value,
        opacity: interpolate(transY.value, [0, INPUT_HEIGHT], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));

    const applyCode = async () => {
        if (!defaultAddress) return;
        if (text.trim() == '') {
            setStatus({
                msg: 'Code cannot be empty',
                status: 'fail',
            });
            return;
        }

        let selected_ship = transfromShipping[0].shipping_info[shippingConfigIndex[0]];
        //TH tách đơn
        if (transfromShipping.length > 1) {
            var checked = selected_ship.name_shipping;
            if (
                transfromShipping.every(
                    (item, index) => item.shipping_info[shippingConfigIndex[index]].name_shipping == checked,
                )
            ) {
                //nếu như option shipping của các đơn đều giống nhau ==> skip
            } else {
                // set shipping là standard
                selected_ship = transfromShipping[0].shipping_info[0];
            }
        }

        var body = {
            code: text,
            amount: cart_sub_total,
            quantity: sumBy(items, i => i.quantity),
            products: items.map(i => ({ price: i.price * i.quantity, id: i.product_id, quantity: i.quantity })),
            shipping_fee: selected_ship.shipping_fee,
            shipping_type: selected_ship.name_shipping,
            phone: defaultAddress.phone,
        };

        try {
            var res = await postCode(body).unwrap();
            if (res.status == 'successful') {
                setStatus({
                    msg: 'Apply code successful',
                    status: 'success',
                });
                dispatch(cart.actions.setPromotion({ promotion_code: text, discount: res.result }));
            }
        } catch (e: any) {
            dispatch(cart.actions.setPromotion({ promotion_code: '', discount: 0 }));
            setStatus({
                msg: e.message || 'Unknown error',
                status: 'fail',
            });
        }
    };

    const toogle = () => {
        if (!isExpand) {
            setExpand(true);
            transY.value = withTiming(INPUT_HEIGHT, { duration: 250 });
        } else {
            setExpand(false);
            transY.value = withTiming(0, { duration: 250 });
        }
    };

    return (
        <View style={{ marginTop: 32, width: '100%' }}>
            <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={toogle}
            >
                <View style={{ flexDirection: 'row' }}>
                    <CouponLogo width={22} height={22} style={{ marginTop: 1 }} />
                    <TextNormal style={{ fontSize: 15, marginLeft: 8 }}>Use promotion code</TextNormal>
                </View>
                <Icon
                    type="feather"
                    name={`chevron-${isExpand ? 'down' : 'right'}`}
                    size={24}
                    style={{ marginTop: -2 }}
                    color={lightColor.primary}
                />
            </Pressable>

            <Animated.View style={[styles.rowInput, animStyle]}>
                <View
                    style={[
                        styles.inputView,
                        codeStatus.status == 'success' && { borderBottomColor: lightColor.success },
                        codeStatus.status == 'fail' && { borderBottomColor: lightColor.error },
                    ]}
                >
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        style={styles.input}
                        placeholder="Enter promotion code"
                        placeholderTextColor={'#999'}
                    />
                </View>
                <Pressable style={styles.applyButton} onPress={applyCode}>
                    {isLoading ? (
                        <ActivityIndicator color={'white'} size={'small'} />
                    ) : (
                        <TextSemiBold style={{ color: 'white', fontSize: 13 }}>Apply</TextSemiBold>
                    )}
                </Pressable>
            </Animated.View>
            {codeStatus.status != 'none' && isExpand && (
                <TextNormal
                    style={[
                        styles.errorText,
                        { color: codeStatus.status == 'success' ? lightColor.success : lightColor.error },
                    ]}
                >
                    {codeStatus.msg}
                </TextNormal>
            )}
        </View>
    );
};

export default memo(PromotionCode);

const styles = StyleSheet.create({
    rowInput: {
        width: '100%',
        height: INPUT_HEIGHT,
        overflow: 'hidden',
        flexDirection: 'row',
        marginTop: 8,
    },
    inputView: {
        flex: 7,
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
    },
    input: {
        fontSize: normalize(14),
        fontFamily: 'Poppins-Regular',
        height: '100%',
        flex: 1,
        color: 'black',
        padding: 0,
        paddingTop: 4,
    },
    applyButton: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
        borderRadius: 6,
    },
    errorText: {
        fontSize: 12,
        marginTop: 3,
    },
});
