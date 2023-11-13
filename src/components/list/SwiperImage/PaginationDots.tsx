import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

const STEP_LENGTH = SCREEN_WIDTH;

const DOT_SIZE = 7;
const MULTIPLIER = 6;

interface IProps {
    data: any[];
    curPos: SharedValue<number>;
}
const PaginationDots = ({ curPos, data }: IProps) => {
    const length = (data.length - 1) * (DOT_SIZE + 10) + (DOT_SIZE * MULTIPLIER + 10);

    // useAnimatedReaction(
    //     () => curPos.value,
    //     data => {
    //         console.log('Position: ' + data);
    //     },
    // );
    return (
        <View style={[styles.container, { width: length }]}>
            {data.map((item, index) => (
                <Dots index={index} curPos={curPos} key={item + index} />
            ))}
        </View>
    );
};

const Dots = ({ index, curPos }: { index: number; curPos: SharedValue<number> }) => {
    const scale = useSharedValue(index == 0 ? MULTIPLIER : 1);

    const animStyle = useAnimatedStyle(() => ({
        width: DOT_SIZE * scale.value,
        backgroundColor: interpolateColor(scale.value, [MULTIPLIER, 1], ['#ff7300', '#ffffff']),
    }));

    useAnimatedReaction(
        () => curPos.value,
        data => {
            var curStep = Math.floor(data / STEP_LENGTH);
            var spare = data - STEP_LENGTH * curStep;

            if (data == 0) {
                scale.value = index == 0 ? MULTIPLIER : 1;
                //reset lại state nếu như scroll về giá trị ban đầu
                // dùng trong trường hợp list bị thay đổi
            } else {
                if (curStep == index) {
                    scale.value = interpolate(spare, [0, STEP_LENGTH - 1], [MULTIPLIER, 1], {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP,
                    });
                } else if (curStep == index - 1) {
                    scale.value = interpolate(spare, [0, STEP_LENGTH - 1], [1, MULTIPLIER], {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP,
                    });
                }
            }
        },
    );
    return <Animated.View style={[styles.dot, animStyle]}></Animated.View>;
};

export default memo(PaginationDots);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',

        position: 'absolute',
        zIndex: 100,
        alignSelf: 'center',
        bottom: 60,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: 16,
    },
});
