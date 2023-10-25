import { TextNormal, TextSemiBold } from '@components/text';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFetchCategoryBannerQuery } from '../service';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { SCREEN_WIDTH } from '@util/index';
import { navigate } from '@navigation/service';

const LARGE_WIDTH = (SCREEN_WIDTH - 44) / 2;
const SMALL_HEIGHT = (LARGE_WIDTH - 12) / 2;
const MainCategory = ({ data }: { data: any[] }) => {
    if (!data) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 16, marginBottom: 16, lineHeight: 28 }}>
                Best for the collections
            </TextSemiBold>
            <View style={styles.rowUp}>
                <View style={styles.bigView}>
                    <ImageCover item={data[0]} />
                </View>
                <View style={styles.bigView}>
                    <View style={styles.smallView}>
                        <ImageCover item={data[1]} />
                    </View>
                    <View style={styles.smallView}>
                        <ImageCover item={data[2]} />
                    </View>
                </View>
            </View>

            <View style={styles.rowDown}>
                <View style={styles.bigView}>
                    <ImageCover item={data[3]} />
                </View>
                <View style={styles.bigView}>
                    <View style={styles.smallView}>
                        <ImageCover item={data[4]} />
                    </View>
                    <View style={styles.smallView}>
                        <ImageCover item={data[5]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default memo(MainCategory);

const ImageCover = ({ item }: { item: any }) => {
    const toSearchResult = () => {
        navigate('SearchResult', { title: item.name, categoryId: item.id });
    };
    return (
        <Pressable style={{ flex: 1 }} onPress={toSearchResult}>
            <FastImage style={{ width: '100%', height: '100%' }} resizeMode="cover" source={{ uri: item.image_url }} />
            <LinearGradient
                style={styles.shadowView}
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <TextSemiBold style={{ color: 'white', fontSize: 18 }}>{item.name}</TextSemiBold>
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: '100%',
    },
    bigView: {
        width: LARGE_WIDTH,
        aspectRatio: 1,
        borderRadius: 6,
        overflow: 'hidden',
        //borderWidth: 1,
        justifyContent: 'space-between',
    },
    rowUp: { flexDirection: 'row', width: '100%', paddingHorizontal: 16, justifyContent: 'space-between' },
    rowDown: {
        flexDirection: 'row-reverse',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 12,
        justifyContent: 'space-between',
    },
    smallView: {
        width: '100%',
        height: SMALL_HEIGHT,
        borderRadius: 6,
        overflow: 'hidden',
        //borderWidth: 1,
    },
    shadowView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 45,
        zIndex: 100,
    },
});
