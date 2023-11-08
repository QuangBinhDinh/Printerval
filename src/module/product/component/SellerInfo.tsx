import { TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { Seller } from '@type/common';
import { randomizeColor } from '@util/index';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const SellerInfo = ({ seller }: { seller?: Seller }) => {
    const random_bg = useMemo(() => randomizeColor(1)[0], []);
    return (
        <View style={styles.container}>
            <View style={[styles.avatar, { backgroundColor: random_bg }]}>
                <FastImage style={{ width: '100%', height: '100%' }} source={{ uri: seller?.image_avatar ?? '' }} />
            </View>
            <View style={[styles.content]}>
                <TextSemiBold style={{ fontSize: 15, marginTop: 0 }}>Designed and sold by</TextSemiBold>
                <TextSemiBold style={{ color: lightColor.secondary, marginTop: 2 }}>{seller?.name}</TextSemiBold>
            </View>
        </View>
    );
};

export default memo(SellerInfo);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 18,
        width: '100%',
        flexDirection: 'row',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 6,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        paddingLeft: 8,
    },
});
