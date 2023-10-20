import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimPressable = Animated.createAnimatedComponent(Pressable);

const CARD_WIDTH = (SCREEN_WIDTH - 32) / 2;
const SupportArtist = () => {
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, lineHeight: 28 }}>
                Support independent{'\n'}
                <TextSemiBold style={{ color: lightColor.secondary }}>Artists </TextSemiBold>and
                <TextSemiBold style={{ color: lightColor.secondary }}> Crafters</TextSemiBold>
            </TextSemiBold>

            <TextNormal style={{ fontSize: 17, marginTop: 14 }}>
                There’s no <TextNormal style={{ color: lightColor.secondary }}>Printerval</TextNormal> warehouse – all
                products belong to creative artists and crafters. We are just a bridge to connect you with dedicated
                makers and get eye-catching pieces.
            </TextNormal>

            <CardSlider />
            <TouchableOpacity style={styles.button}>
                <TextSemiBold style={{ fontSize: 17, color: 'white' }}>Start selling</TextSemiBold>
            </TouchableOpacity>
        </View>
    );
};
export default memo(SupportArtist);

const CardSlider = () => {
    const transArr = useSharedValue([0, 0, 0, 0]);

    const animStyle = (index: number) =>
        useAnimatedStyle(() => ({
            transform: [{ translateX: transArr.value[index] }],
        }));

    const moveCard = (index: number) => () => {
        if (index > 0) {
            var curArr = [...transArr.value];
            var newArr = curArr.map((pos, i) => {
                if (i == 0) return 0;
                if (i <= index) return -(CARD_WIDTH * 2) / 3;
                return 0;
            });

            transArr.value = withTiming(newArr, { duration: 300 });
        } else transArr.value = withTiming([0, 0, 0, 0], { duration: 300 });
    };
    return (
        <View style={styles.slider}>
            <AnimPressable
                style={[styles.card, { backgroundColor: lightColor.primary }, animStyle(0)]}
                onPress={moveCard(0)}
            />
            <AnimPressable
                style={[styles.card, { backgroundColor: lightColor.secondary }, animStyle(1)]}
                onPress={moveCard(1)}
            />
            <AnimPressable
                onPress={moveCard(2)}
                style={[
                    styles.card,
                    { backgroundColor: lightColor.yellowstar, marginLeft: (-CARD_WIDTH / 3) * 2 },
                    animStyle(2),
                ]}
            />
            <AnimPressable
                onPress={moveCard(3)}
                style={[
                    styles.card,
                    { backgroundColor: lightColor.grayout, marginLeft: (-CARD_WIDTH / 3) * 2 },
                    animStyle(3),
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 16,
    },
    slider: {
        width: SCREEN_WIDTH - 32,
        aspectRatio: 2,
        marginTop: 14,
        borderRadius: 5,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    card: { width: CARD_WIDTH, aspectRatio: 1, borderRadius: 5 },
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 18,
        backgroundColor: lightColor.primary,
    },
});
