import { TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { Seller } from '@type/common';
import { randomizeColor } from '@util/index';
import { capitalize } from 'lodash';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { navigate } from '@navigation/service';

const SellerInfo = ({ seller, prodImg }: { seller?: Seller; prodImg?: string }) => {
    const random_bg = useMemo(() => randomizeColor(1)[0], []);

    const toSellerPage = () => {
        console.log(seller);

        if (seller) {
            var newSeller: Seller = { ...seller, ...(!seller.image_avatar && { image_avatar: prodImg }) };
            navigate('SellerPage', { seller: newSeller });
        }
    };
    return (
        <Pressable style={styles.container} onPress={toSellerPage}>
            <View style={[styles.avatar]}>
                <FastImage
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: seller?.image_avatar || prodImg }}
                />
            </View>
            <View style={[styles.content]}>
                <TextSemiBold style={{ fontSize: 15, marginTop: 0 }}>Designed and sold by</TextSemiBold>
                <TextSemiBold style={{ color: lightColor.secondary, marginTop: 2 }}>
                    {capitalize(seller?.name.trim())}
                </TextSemiBold>
            </View>
        </Pressable>
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
        backgroundColor: lightColor.graybg,
    },
    content: {
        flex: 1,
        paddingLeft: 8,
    },
});
