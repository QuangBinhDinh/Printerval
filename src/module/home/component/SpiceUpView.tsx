import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import { cloneDeep } from 'lodash';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

/**
 * Duration transition change image
 */
const ANIM_DURATION = 500;

const AnimatedImage = Animated.createAnimatedComponent(FastImage);
const SpiceUpView = ({ listImg }: { listImg: string[] }) => {
    const [listImage, setImage] = useState<string[]>(listImg);
    const [nextImage, setNext] = useState<any>(null);

    const toNextImage = () => {
        var temp = cloneDeep(listImage);
        var remove = temp.shift();
        temp.push(remove);
        setNext(temp);
    };
    const toPrevImage = () => {
        var temp = cloneDeep(listImage);
        var remove = temp.pop();
        temp.unshift(remove);
        setNext(temp);
    };

    const opacity = useSharedValue(0);
    const animImage = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    useEffect(() => {
        if (nextImage) {
            opacity.value = withTiming(1, { duration: ANIM_DURATION }, finished => {
                if (finished) {
                    runOnJS(setImage)(nextImage);
                }
            });
        }
    }, [nextImage]);

    useEffect(() => {
        opacity.value = withTiming(0, { duration: 50 });
    }, [listImage]);

    return (
        <View style={{ width: SCREEN_WIDTH, marginTop: 32 }}>
            <View style={styles.contentView}>
                <ImageBackground
                    style={{ flex: 1, paddingHorizontal: 12 }}
                    source={require('@assets/image/bg-spice.png')}
                    resizeMode="cover"
                >
                    <TextSemiBold style={{ fontSize: 20, marginTop: 150 }}>
                        <TextSemiBold style={{ color: lightColor.secondary }}>Printerval</TextSemiBold> Spice up your
                        life
                    </TextSemiBold>
                    <TextNormal style={{ fontSize: 15, marginTop: 14 }}>
                        <TextNormal style={{ color: lightColor.secondary }}>Printerval.com</TextNormal> is an online
                        marketplace, where people come together to make, sell, buy, and collect unique items. There’s no
                        Printerval warehouse – just independent sellers selling the things they love.{'\n'}
                        {'\n'}We make the whole process easy, helping you connect directly with makers to find something
                        extraordinary.
                    </TextNormal>
                </ImageBackground>
            </View>
            <View style={styles.imageContainer}>
                <Pressable style={styles.smallImage} onPress={toPrevImage}>
                    <FastImage style={[styles.image]} source={{ uri: listImage[0] }} />
                    {!!nextImage && (
                        <AnimatedImage
                            style={[StyleSheet.absoluteFillObject, animImage]}
                            source={{ uri: nextImage[0] }}
                            resizeMode={'cover'}
                        />
                    )}
                </Pressable>
                <Pressable style={styles.smallImage} onPress={toNextImage}>
                    <FastImage style={styles.image} source={{ uri: listImage[2] }} />
                    {!!nextImage && (
                        <AnimatedImage
                            style={[StyleSheet.absoluteFillObject, animImage]}
                            source={{ uri: nextImage[2] }}
                            resizeMode={'cover'}
                        />
                    )}
                </Pressable>
                <View style={styles.bigImage}>
                    <FastImage style={styles.image} source={{ uri: listImage[1] }} />
                    {!!nextImage && (
                        <AnimatedImage
                            style={[StyleSheet.absoluteFillObject, animImage]}
                            source={{ uri: nextImage[1] }}
                            resizeMode={'cover'}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default memo(SpiceUpView);

const styles = StyleSheet.create({
    contentView: { width: SCREEN_WIDTH, height: SCREEN_WIDTH >= 400 ? 420 : 450, marginTop: 100 },
    imageContainer: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 220,
        position: 'absolute',
        top: 0,
    },
    smallImage: {
        width: (SCREEN_WIDTH - 5) / 3,
        aspectRatio: 1,
        borderRadius: 130,
        borderWidth: 2,
        borderColor: lightColor.primary,
        overflow: 'hidden',
    },
    bigImage: {
        width: SCREEN_WIDTH * 0.55,
        height: SCREEN_WIDTH * 0.55,
        position: 'absolute',
        left: SCREEN_WIDTH * 0.225,
        right: SCREEN_WIDTH * 0.225,
        borderRadius: 130,
        borderWidth: 2,
        borderColor: lightColor.secondary,

        overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
});
