import { CouponLogo } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
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

const INPUT_HEIGHT = 40;

const PromotionCode = () => {
    const [isExpand, setExpand] = useState(false);
    const [text, setText] = useState('');

    const transY = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({
        height: transY.value,
        opacity: interpolate(transY.value, [0, INPUT_HEIGHT], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));

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
                <View style={styles.inputView}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        style={styles.input}
                        placeholder="Enter promotion code"
                    />
                </View>
                <Pressable style={styles.applyButton}>
                    <TextSemiBold style={{ color: 'white', fontSize: 13 }}>Apply</TextSemiBold>
                </Pressable>
            </Animated.View>
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
        fontSize: normalize(15),
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
});
