import React, { memo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const HeaderBanner = () => {
    const renderItem = ({ item }: { item: any }) => <Banner item={item} />;
    return (
        <View style={{ width: '100%' }}>
            <FastImage style={styles.img} source={require('@image/app-logo-2.png')} />
            <FlatList
                data={[1, 2, 3, 4, 5]}
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
            <FastImage style={{ width: '100%', height: '100%' }} />
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
        marginTop: 16,
        width: '100%',
        height: 210,
    },
    item: {
        width: 335,
        height: 210,
        borderRadius: 6,
        overflow: 'hidden',
        marginLeft: 12,
        borderWidth: 1,
    },
});
