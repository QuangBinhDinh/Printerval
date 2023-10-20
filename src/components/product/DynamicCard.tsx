import { TextSemiBold, TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { Product } from '@type/common';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import he from 'he';
import { cdnImage } from '@util/cdnImage';

const DynamicCard = ({ item, style }: { item: Product; style?: StyleProp<ViewStyle> }) => {
    const discountText = useMemo(() => {
        var percent = '';
        var amount = Number(item.high_price) - Number(item.price);
        if (amount > 0) {
            percent = `-${Math.round((amount / Number(item.high_price)) * 100)}%`;
        }
        return percent;
    }, [item]);

    const toDetail = () => {
        console.log(item);
    };
    return (
        <Pressable style={[styles.container, style]} onPress={toDetail}>
            {!!discountText && (
                <View style={styles.discount}>
                    <TextSemiBold style={{ fontSize: 13, color: 'white' }}>{discountText}</TextSemiBold>
                </View>
            )}

            <FastImage style={styles.image} source={{ uri: cdnImage(item.image_url) }} resizeMode="cover" />
            <TextSemiBold style={styles.title} numberOfLines={4}>
                {he.decode(item.name)}
            </TextSemiBold>

            <TextNormal style={styles.subTitle}>{'Sample Text'}</TextNormal>
            <TextSemiBold style={styles.price}>
                {item.display_price} <TextNormal style={styles.oldPrice}>{item.display_high_price}</TextNormal>
            </TextSemiBold>
        </Pressable>
    );
};

export default memo(DynamicCard);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 24,
        //borderWidth: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 0.9,
        marginBottom: 8,
        borderRadius: 6,
        overflow: 'hidden',
    },
    title: {
        fontSize: 16,
        lineHeight: 20,
        width: '100%',
    },
    subTitle: {
        fontSize: 14,
        color: lightColor.grayout,
        marginTop: 3,
    },
    price: {
        color: lightColor.price,
        fontSize: 18,
        marginTop: 0,
    },
    oldPrice: { fontSize: 14, color: lightColor.grayout, textDecorationLine: 'line-through' },
    discount: {
        width: 52,
        height: 28,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.price,
        position: 'absolute',
        zIndex: 100,
        top: 6,
        left: 4,
    },
});
