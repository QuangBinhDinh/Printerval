import React, { memo } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    interpolateColor,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Icon } from '@rneui/base';
import { ShareIcon } from '@assets/svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import { goBack } from '@navigation/service';
import { TextSemiBold } from '@components/text';

interface IProps {
    scrollY: SharedValue<number>;

    title: string;
}

const AnimatedHeader = ({ scrollY, title }: IProps) => {
    const insets = useSafeAreaInsets();

    const animHeader = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(scrollY.value, [0, 150], ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']),
        borderBottomColor: interpolateColor(scrollY.value, [0, 150], ['rgba(225,225,225,0)', 'rgba(225,225,225,1)']),
    }));

    const animTitle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(scrollY.value, [200, 250], [50, 0], {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP,
                }),
            },
        ],
    }));
    return (
        <Animated.View
            style={[styles.header, { height: 54 + insets.top / 1.5, paddingTop: 6 + insets.top / 1.5 }, animHeader]}
        >
            <Pressable style={styles.button} onPress={goBack}>
                <Icon type="antdesign" name="arrowleft" size={22} color={lightColor.secondary} />
            </Pressable>
            <Animated.View style={[styles.titleView, animTitle]}>
                <TextSemiBold style={{ fontSize: 18 }} numberOfLines={1}>
                    {title}
                </TextSemiBold>
            </Animated.View>
            <Pressable style={styles.button}>
                <ShareIcon width={26} height={22} />
            </Pressable>
        </Animated.View>
    );
};

export default memo(AnimatedHeader);

const styles = StyleSheet.create({
    header: {
        height: 48,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 200,
        position: 'absolute',
        top: 0,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        overflow: 'hidden',
    },
    button: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleView: { flex: 1, height: '100%', justifyContent: 'center', paddingHorizontal: 5 },
});
