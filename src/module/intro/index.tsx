import { TextNormal, TextSemiBold } from '@components/text';
import { STORAGE_KEY } from '@constant/index';
import { navigate } from '@navigation/service';
import { normalize } from '@rneui/themed';
import { lightColor } from '@styles/color';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@util/index';
import storage from '@util/storage';
import React, { useRef, useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAGE_WIDTH = Math.round(SCREEN_WIDTH);

const PAGES = [
    {
        id: 0,
        source: require('@image/Intro/banner0-min.jpg'),
        content: 'An online marketplace, where people come together to make, sell, buy, and collect unique items',
    },
    {
        id: 1,
        source: require('@image/Intro/banner1-min.jpg'),
        content:
            'Shop for millions of handmade, vintage, clothes and unique gifts from independent artists and crafters',
    },
    {
        id: 2,
        source: require('@image/Intro/banner2-min.jpg'),
        content: 'Perfect fit, Free Refund Return and Replacement with "Printerval Guarantee"',
    },
    {
        id: 3,
        source: require('@image/Intro/banner3-min.jpg'),
        content: 'Choose another country or region to see content specific to your location and shop online.',
    },
];
const IntroScreen = () => {
    const ref = useRef<ScrollView>();
    const insets = useSafeAreaInsets();

    const [curPage, setPage] = useState(0);

    //scroll hết intro sẽ vào app
    const scrollNext = () => {
        if (curPage < 3) {
            ref.current?.scrollTo({ y: 0, x: PAGE_WIDTH * (curPage + 1) });
        } else {
            navigate('App');
            storage.save(STORAGE_KEY.INTRO_FLAG, 'pass');
        }
    };

    const toSkip = () => {
        navigate('App');
        storage.save(STORAGE_KEY.INTRO_FLAG, 'pass');
    };

    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        var pageIndex = Math.round(nativeEvent.contentOffset.x / PAGE_WIDTH);
        console.log('page', pageIndex);
        setPage(pageIndex);
    };

    const TextHightlight = () => {
        if (curPage == 0)
            return (
                <TextSemiBold style={styles.whiteText}>
                    Welcome to{'\n'}
                    <TextSemiBold style={styles.highlightText}>Printerval</TextSemiBold>
                </TextSemiBold>
            );
        if (curPage == 1)
            return (
                <TextSemiBold style={styles.whiteText}>
                    Shop and{'\n'}
                    <TextSemiBold style={styles.highlightText}>Earn rewards</TextSemiBold>
                </TextSemiBold>
            );
        if (curPage == 2)
            return (
                <TextSemiBold style={styles.whiteText}>
                    100% <TextSemiBold style={styles.highlightText}>Happy{'\n'}</TextSemiBold>
                    100%{''}
                    <TextSemiBold style={styles.highlightText}>Love</TextSemiBold>
                </TextSemiBold>
            );
        return (
            <TextSemiBold style={styles.whiteText}>
                Choose <TextSemiBold style={styles.highlightText}>region</TextSemiBold>
            </TextSemiBold>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                ref={ref}
                style={{ flex: 1 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={PAGE_WIDTH}
                decelerationRate={'fast'}
                onScroll={onScroll}
                scrollEventThrottle={8}
                bounces={false}
            >
                {PAGES.map(item => (
                    <View style={styles.imageContainer} key={item.id}>
                        <Image style={styles.image} resizeMode="cover" source={item.source} />
                    </View>
                ))}
            </ScrollView>

            <LinearGradient
                style={styles.gradient}
                colors={['rgba(17, 17, 17, 0)', 'black']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.6 }}
            >
                <View style={styles.rowButton}>
                    <Pressable hitSlop={20} onPress={toSkip}>
                        <TextSemiBold style={{ fontSize: 18, color: 'white' }}>Skip</TextSemiBold>
                    </Pressable>

                    <Pressable style={styles.nextButton} onPress={scrollNext}>
                        <TextSemiBold style={{ fontSize: 18, color: 'white', marginTop: 1 }}>Next</TextSemiBold>
                    </Pressable>
                </View>

                <TextNormal style={{ fontSize: 18, lineHeight: 27, color: 'white' }}>
                    {PAGES[curPage]?.content}
                </TextNormal>

                <TextHightlight />
            </LinearGradient>
        </View>
    );
};

export default IntroScreen;

const styles = StyleSheet.create({
    imageContainer: {
        width: PAGE_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'black',
    },

    image: {
        width: PAGE_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
    gradient: {
        width: PAGE_WIDTH,
        height: normalize(328),
        //borderWidth:1,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 16,
        flexDirection: 'column-reverse',
    },
    rowButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 36,
        marginTop: 16,
    },
    nextButton: {
        width: 120,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: lightColor.secondary,
    },
    highlightText: {
        fontSize: 38,
        lineHeight: 45,
        color: lightColor.secondary,
    },
    whiteText: {
        fontSize: 38,
        lineHeight: 45,
        color: 'white',
        marginBottom: 16,
    },
});
