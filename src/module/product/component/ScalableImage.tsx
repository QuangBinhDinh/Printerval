import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH } from '@util/index';
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { shadow } from '@styles/shadow';

const MAX_SCALE = SCREEN_WIDTH / 75;

/**
 * Hiển thị ảnh color guide
 * @returns
 */
const ScalableImage = ({ imageUrl }: { imageUrl: string }) => {
    const scale = useSharedValue(1);
    const margin = useSharedValue(5);

    // muốn scale từ corner thì k dùng transform scale , mà set width/height + position absolute
    const scaleAnimationStyle = useAnimatedStyle(() => ({
        width: 75 * scale.value,
        height: 75 * scale.value,
        right: margin.value,
        bottom: interpolate(margin.value, [5, 1], [50, 0], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));

    const toogleScale = () => {
        if (scale.value == 1) {
            scale.value = withTiming(MAX_SCALE, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
            margin.value = withTiming(0);
        } else {
            scale.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
            margin.value = withTiming(5);
        }
    };
    // const memoImage = useMemo(
    //     () => <FastImage style={{ width: '90%', height: '90%' }} resizeMode="contain" source={{ uri: imageUrl }} />,
    //     [imageUrl],
    // );

    useEffect(() => {
        //console.log(imageUrl);
        if (imageUrl) {
            scale.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
            margin.value = withTiming(5);
        }
    }, [imageUrl]);

    return (
        <Animated.View style={[styles.smallImage, shadow, scaleAnimationStyle]}>
            <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={toogleScale}>
                <FastImage style={{ width: '95%', height: '95%' }} resizeMode="contain" source={{ uri: imageUrl }} />
            </Pressable>
        </Animated.View>
    );
};

export default memo(ScalableImage);
const styles = StyleSheet.create({
    smallImage: {
        position: 'absolute',
        bottom: 50,
        right: 5,
        width: 5,
        height: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        zIndex: 200,
    },
});
