import { BuyCoffee } from '@assets/svg';
import { TextNormal } from '@components/text';
import { normalize } from '@rneui/themed';
import { useAppDispatch } from '@store/hook';
import { lightColor } from '@styles/color';
import { formatPrice } from '@util/index';
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

const TIPS_THRESHOLD = 80;

const INPUT_HEIGHT = 40;

const DATA = [
    {
        title: 'No tips',
        value: 0,
    },
    {
        title: '$5.00',
        value: 5,
    },
    {
        title: '$3.00',
        value: 3,
    },
    {
        title: '$2.00',
        value: 2,
    },
    {
        title: '$1.00',
        value: 1,
    },
    {
        title: 'Other',
        value: -1,
    },
];

const TipSelection = () => {
    const dispatch = useAppDispatch();

    const firstRow = DATA.filter((item, index) => index < DATA.length / 2);
    const secondRow = DATA.filter((item, index) => index >= DATA.length / 2);

    const [tip, setTip] = useState({ title: 'No tips', value: 0 });
    const [customTip, setCustomTip] = useState('');
    const changeTipText = (text: string) => {
        //xoá các kí tự kp là số
        setCustomTip(text.replace(/[^0-9]/g, '').trim());
    };

    const transY = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({
        height: transY.value,
        opacity: interpolate(transY.value, [0, INPUT_HEIGHT], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));

    useEffect(() => {
        if (tip.value == -1) {
            transY.value = withTiming(INPUT_HEIGHT, { duration: 250 });
            setCustomTip('');
        } else {
            transY.value = withTiming(0, { duration: 250 });
        }
    }, [tip]);

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
                {firstRow.map(item => (
                    <Pressable
                        onPress={() => setTip(item)}
                        style={[styles.tipView, item.value == tip.value && { borderColor: lightColor.secondary }]}
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

            <View style={styles.tipRow}>
                {secondRow.map(item => (
                    <Pressable
                        onPress={() => setTip(item)}
                        style={[styles.tipView, item.value == tip.value && { borderColor: lightColor.secondary }]}
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

            <Animated.View style={[styles.inputView, animStyle]}>
                <TextInput
                    value={customTip ? formatPrice(customTip) : ''}
                    onChangeText={changeTipText}
                    style={styles.input}
                    placeholder="Specify an amount"
                    keyboardType="numeric"
                />
            </Animated.View>
        </View>
    );
};

export default memo(TipSelection);

const styles = StyleSheet.create({
    tipRow: {
        flexDirection: 'row',
        marginTop: 12,
        justifyContent: 'space-between',
    },
    tipView: {
        height: 40,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.lightbg,
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        borderRadius: 6,
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
        fontSize: normalize(15),
        fontFamily: 'Poppins-Regular',
        height: '100%',
        flex: 1,
        color: 'black',
        padding: 0,
        paddingTop: 4,
    },
});
