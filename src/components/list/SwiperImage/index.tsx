import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { ScrollView } from 'react-native';
import PaginationDots from './PaginationDots';
import { cdnImage } from '@util/cdnImage';
import { lightColor } from '@styles/color';

const SwiperImage = ({ images }: { images: string[] }) => {
    const refFlatList = useRef<ScrollView>();
    const scrollPos = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(e => {
        var x = e.contentOffset.x;
        scrollPos.value = x;
    });

    //const newImages = images.map(i => cdnImage(i, 630, 630));

    useEffect(() => {
        if (images) refFlatList.current?.scrollTo({ x: 0, animated: false });
    }, [images]);
    return (
        <>
            <Animated.ScrollView
                ref={refFlatList}
                horizontal
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center' }}
                scrollEventThrottle={1}
                snapToInterval={SCREEN_WIDTH}
                decelerationRate={'fast'}
                onScroll={scrollHandler}
                showsHorizontalScrollIndicator={false}
            >
                {images.map(item => (
                    <FastImage
                        source={{ uri: item }}
                        style={{ width: SCREEN_WIDTH, aspectRatio: 1, backgroundColor: lightColor.graybg }}
                        key={item}
                        resizeMode="cover"
                    />
                ))}
            </Animated.ScrollView>
            {images.length > 1 && <PaginationDots data={images} curPos={scrollPos} />}
        </>
    );
};

export default memo(SwiperImage);
