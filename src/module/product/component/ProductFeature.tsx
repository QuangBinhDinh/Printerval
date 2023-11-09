import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@rneui/base';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { debounce } from 'lodash';
import he from 'he';
import { Nullable } from '@type/base';
import { stripHTMLTags } from '@util/index';

const MAX_HEIGHT = 700;
const MIN_HEIGHT = 220;
const ProductFeature = ({ description }: { description: Nullable<string> }) => {
    const [isFull, setFull] = useState(false);
    const [maxHeight, setMax] = useState(MAX_HEIGHT);
    const height = useSharedValue(MIN_HEIGHT);

    const animatedHeight = useAnimatedStyle(() => ({
        height: height.value,
    }));

    const showFull = () => {
        if (!isFull) {
            setFull(true);
            height.value = withTiming(maxHeight + 16, { duration: 350 });
        } else {
            setFull(false);
            height.value = withTiming(MIN_HEIGHT, { duration: 350 });
        }
    };

    const stripedString = stripHTMLTags(description);

    if (!stripedString.trim()) return null;
    return (
        <>
            <Animated.View style={[styles.container, animatedHeight]}>
                <ScrollView
                    scrollEnabled={false}
                    style={{ flex: 1 }}
                    onContentSizeChange={(w, h) => setMax(h)}
                    showsVerticalScrollIndicator={false}
                >
                    <TextSemiBold style={{ fontSize: 20, lineHeight: 24 }}>Features</TextSemiBold>

                    <TextNormal style={styles.desText}>{stripedString}</TextNormal>
                </ScrollView>
                {!isFull && (
                    <LinearGradient
                        style={[StyleSheet.absoluteFill]}
                        start={{ x: 0, y: 0.6 }}
                        end={{ y: 1, x: 0 }}
                        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                        pointerEvents="none"
                    />
                )}
            </Animated.View>
            <Pressable style={styles.moreButton} hitSlop={12} onPress={showFull}>
                <TextNormal style={{ color: lightColor.secondary }}>{isFull ? 'See less' : 'See more'}</TextNormal>
            </Pressable>
        </>
    );
};

export default memo(ProductFeature);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 240,
        marginTop: 32,
        zIndex: 200,
        paddingHorizontal: 18,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    desText: {
        marginTop: 12,
        fontSize: 15,
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: 0,
    },
});
