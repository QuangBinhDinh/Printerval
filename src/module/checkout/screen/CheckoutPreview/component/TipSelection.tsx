import { BuyCoffee } from '@assets/svg';
import cart from '@cart/reducer';
import { TextNormal } from '@components/text';
import { normalize } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
    useSharedValue,
    interpolate,
    useAnimatedStyle,
    Extrapolation,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventEmitter from '../../../../../EventEmitter';
import { err } from 'react-native-svg/lib/typescript/xml';

const TIPS_THRESHOLD = 80;

const INPUT_HEIGHT = 40;

const DATA = [
    {
        title: 'No tips',
        value: 0,
        percent: false,
    },
    {
        title: '$5.00',
        value: 5,
        percent: false,
    },
    {
        title: '$3.00',
        value: 3,
        percent: false,
    },
    {
        title: '$2.00',
        value: 2,
        percent: false,
    },
    {
        title: '$1.00',
        value: 1,
        percent: false,
    },
    {
        title: 'Other',
        value: -1,
        percent: false,
    },
];

const PERCENT_DATA = [
    {
        title: 'No tips',
        value: 0,
        percent: true,
    },
    {
        title: '15%',
        value: 0.15,
        percent: true,
    },
    {
        title: '10%',
        value: 0.1,
        percent: true,
    },
    {
        title: '5%',
        value: 0.05,
        percent: true,
    },

    {
        title: 'Other',
        value: -1,
        percent: false,
    },
];

const EVENT_NAME = 'error_custom_tips';

const TipSelection = () => {
    const dispatch = useAppDispatch();
    const subTotal = useAppSelector(state => state.cart.cart_sub_total);

    //vượt quá threshold sẽ tính tips theo %
    const tipsList = subTotal > TIPS_THRESHOLD ? PERCENT_DATA : DATA;

    const [tip, setTip] = useState({ title: 'No tips', value: 0, percent: false });
    const [customTip, setCustomTip] = useState('');
    const changeTipText = (text: string) => {
        //xoá các kí tự kp là số
        setCustomTip(text.replace(/[^0-9]/g, '').trim());
    };

    const [error, setError] = useState(false);

    const showError = () => setError(true);

    const transY = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({
        height: transY.value,
        opacity: interpolate(transY.value, [0, INPUT_HEIGHT], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));

    const submitCustomTip = () => {
        if (!!customTip) {
            setError(false);
            dispatch(cart.actions.setTipsAmount({ value: Number(customTip), percent: false }));
        }
    };

    useEffect(() => {
        if (tip.value == -1) {
            transY.value = withTiming(INPUT_HEIGHT, { duration: 250 });
            setCustomTip('');
        } else {
            transY.value = withTiming(0, { duration: 250 });
            setError(false);
        }
        dispatch(cart.actions.setTipsAmount({ value: tip.value, percent: tip.percent }));
    }, [tip]);

    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, showError);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, showError);
        };
    }, []);

    return (
        <View style={{ width: '100%', marginTop: 16 }}>
            <View style={{ flexDirection: 'row' }}>
                <BuyCoffee width={22} height={29} />
                <TextNormal style={{ fontSize: 15, color: lightColor.primary, marginLeft: 8 }}>
                    Enjoy your purchase?
                </TextNormal>
            </View>
            <TextNormal style={{ marginTop: 4 }}>Buy our designers a coffee. Thank you!</TextNormal>
            <View style={styles.tipRow}>
                {tipsList.map((item, index) => (
                    <Pressable
                        onPress={() => setTip(item)}
                        style={[
                            styles.tipView,
                            item.value == tip.value && { borderColor: lightColor.secondary, backgroundColor: 'white' },
                            index % 3 == 2 && { marginRight: 0 },
                        ]}
                        key={item.value}
                    >
                        <TextNormal
                            style={[styles.textTips, item.value == tip.value && { color: lightColor.secondary }]}
                        >
                            {item.title}
                        </TextNormal>
                    </Pressable>
                ))}
            </View>

            <Animated.View style={[styles.inputView, animStyle, error && { borderBottomColor: lightColor.error }]}>
                <TextInput
                    value={customTip ? formatPrice(customTip) : ''}
                    onChangeText={changeTipText}
                    style={styles.input}
                    placeholder="Specify an amount"
                    keyboardType="numeric"
                    placeholderTextColor={'#999'}
                    onBlur={submitCustomTip}
                />
            </Animated.View>
            {error && <TextNormal style={styles.error}>Please enter tips amount!</TextNormal>}
        </View>
    );
};

export default memo(TipSelection);

/**
 * force user phải điền custom tips nếu đc chọn
 */
export const showTipsError = () => {
    EventEmitter.dispatch(EVENT_NAME);
};

const styles = StyleSheet.create({
    tipRow: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
    },
    tipView: {
        height: 40,
        width: (SCREEN_WIDTH - 38 - 16 * 2) / 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.lightbg,
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        borderRadius: 6,
        marginTop: 12,
        marginRight: 16,
    },
    textTips: {
        fontSize: 15,
    },
    inputView: {
        marginTop: 16,
        width: '100%',
        height: INPUT_HEIGHT,
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
    error: { fontSize: 11, lineHeight: 13, color: lightColor.error, marginTop: 4 },
});
