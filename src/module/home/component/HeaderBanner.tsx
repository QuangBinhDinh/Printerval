import { PrintervalLogo } from '@assets/svg';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const HeaderBanner = ({ data }: { data: any[] }) => {
    const renderItem = ({ item }: { item: any }) => <Banner item={item} />;
    return (
        <View style={{ width: '100%', marginTop: 18 }}>
            {/* <PrintervalLogo width={144} height={36} style={{ marginLeft: 20 }} /> */}
            <FlatList
                data={data}
                style={styles.list}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
            />
        </View>
    );
};

export default memo(HeaderBanner);

const Banner = ({ item }: { item: any }) => {
    return (
        <Pressable style={styles.item}>
            <FastImage style={{ width: '100%', height: '100%' }} source={{ uri: item.image_url }} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    img: {
        marginLeft: 20,
        height: 36,
        width: 144,
    },
    list: {
        width: '100%',
        minHeight: 210,
    },
    item: {
        width: (SCREEN_WIDTH * 335) / 375,
        aspectRatio: 335 / 210,
        borderRadius: 6,
        overflow: 'hidden',
        marginLeft: 12,
        //borderWidth: 1,
    },
});
