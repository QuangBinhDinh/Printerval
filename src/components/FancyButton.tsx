import React from 'react';
import { StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedHightlight = Animated.createAnimatedComponent(TouchableHighlight);

interface IProps {
    style: StyleProp<ViewStyle>;
    backgroundColor: string;
    onPress: any;
    children: JSX.Element;
}
/**
 *  Animated button with scale animation
 *
 *  Note: Styling button này không nên để padding
 *  @author binhchili
 */
const FancyButton = ({ style, backgroundColor, onPress, children }: IProps) => {
    const buttonScale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const pressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 150 });
    };
    const pressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };
    return (
        <AnimatedHightlight onPress={onPress} style={[style, animStyle]} onPressIn={pressIn} onPressOut={pressOut}>
            <View style={[styles.innerButton, { backgroundColor }]}>{children}</View>
        </AnimatedHightlight>
    );
};

export default FancyButton;

const styles = StyleSheet.create({
    innerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
});
