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
import { CartSecondary, ShareIcon } from '@assets/svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import { goBack, navigate } from '@navigation/service';
import { TextSemiBold } from '@components/text';
import { SCREEN_WIDTH } from '@util/index';
import { useAppDispatch } from '@store/hook';
import { api } from '@api/service';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IProps {
    scrollY: SharedValue<number>;

    title: string;
}

const AnimatedHeader = ({ scrollY, title }: IProps) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const animHeader = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(scrollY.value, [0, 150], ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']),
        borderBottomColor: interpolateColor(scrollY.value, [0, 150], ['rgba(225,225,225,0)', 'rgba(225,225,225,1)']),
    }));

    const toCart = () => {
        dispatch(api.util.invalidateTags(['Cart']));
        navigate('CartNavigator');
    };

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

    const headerRight = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(scrollY.value, [100, 200], [35, 0], {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP,
                }),
            },
        ],
    }));

    const cartStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [100, 200], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    }));
    return (
        <Animated.View
            style={[styles.header, { height: 54 + insets.top / 1.5, paddingTop: 6 + insets.top / 1.5 }, animHeader]}
        >
            <Pressable style={styles.button} onPress={goBack}>
                <Icon type="antdesign" name="arrowleft" size={22} color={lightColor.secondary} />
            </Pressable>
            <Animated.View style={[styles.titleView, animTitle]}>
                <TextSemiBold style={{ fontSize: 18, marginTop: 3 }} numberOfLines={1}>
                    {title}
                </TextSemiBold>
            </Animated.View>

            <Animated.View style={[styles.rightContainer, headerRight]}>
                <Pressable style={styles.rightButton}>
                    <ShareIcon width={22} height={22} />
                </Pressable>
                <AnimatedPressable style={[styles.rightButton, cartStyle]} onPress={toCart}>
                    <CartSecondary width={23} height={23} />
                </AnimatedPressable>
            </Animated.View>
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
    rightContainer: { flexDirection: 'row', width: 80, height: 48 },
    rightButton: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    titleView: { flex: 1, height: '100%', justifyContent: 'center' },
});
