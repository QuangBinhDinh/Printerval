import { TextSemiBold, TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { Product } from '@type/common';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import he from 'he';
import { cdnImage } from '@util/cdnImage';
import StarRating from '@components/StarRating';
import { Icon } from '@rneui/base';
import { Favorite } from '@assets/svg';
import { navigate, pushNavigate } from '@navigation/service';

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
        //console.log(item);
        navigate('DetailProduct', { productId: item.id, productName: item.name }, item.id);
    };
    return (
        <Pressable style={[styles.container, style]} onPress={toDetail}>
            {!!discountText && (
                <View style={styles.discount}>
                    <TextNormal style={{ fontSize: 12, color: 'white', lineHeight: 16 }}>{discountText}</TextNormal>
                </View>
            )}

            <Pressable style={styles.favButton}>
                <Favorite width={15} height={15} />
            </Pressable>

            <FastImage style={styles.image} source={{ uri: cdnImage(item.image_url) }} resizeMode="cover" />
            <View style={styles.rating}>
                <StarRating rating={5} width={80} />
                <TextNormal style={styles.ratingText}>{`(${20})`}</TextNormal>
            </View>
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
        marginBottom: 14,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: lightColor.graybg,
    },
    rating: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    ratingText: { color: lightColor.grayout, marginLeft: 5, fontSize: 12, lineHeight: 14, marginTop: 2 },
    title: {
        fontSize: 14,
        lineHeight: 18,
        width: '100%',
    },
    subTitle: {
        fontSize: 12,
        color: lightColor.grayout,
        marginTop: 3,
        lineHeight: 16,
    },
    price: {
        color: lightColor.price,
        fontSize: 18,
    },
    oldPrice: { fontSize: 14, color: lightColor.grayout, textDecorationLine: 'line-through' },
    discount: {
        width: 48,
        height: 26,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.price,
        position: 'absolute',
        zIndex: 100,
        top: 7,
        left: 6,
    },
    favButton: {
        width: 30,
        height: 30,
        borderWidth: 1.5,
        borderColor: lightColor.price,
        backgroundColor: '#fff',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        top: 6,
        right: 6,
    },
});
