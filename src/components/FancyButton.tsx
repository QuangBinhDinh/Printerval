import React from 'react';
import { StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedHightlight = Animated.createAnimatedComponent(TouchableHighlight);

interface IProps {
    style: StyleProp<ViewStyle>;
    backgroundColor: string;
    onPress: any;
    children: JSX.Element;
    disabled?: boolean;
}
/**
 *  Animated button with scale animation
 *
 *  Note: Styling button này không nên để padding
 *  @author binhchili
 */
const FancyButton = ({ style, backgroundColor, onPress, children, disabled }: IProps) => {
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
        <AnimatedHightlight
            onPress={onPress}
            style={[style, { overflow: 'hidden' }, animStyle]}
            onPressIn={pressIn}
            onPressOut={pressOut}
            underlayColor={backgroundColor}
            disabled={disabled}
        >
            {children}
        </AnimatedHightlight>
    );
};

export default FancyButton;

const styles = StyleSheet.create({
    innerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
});
