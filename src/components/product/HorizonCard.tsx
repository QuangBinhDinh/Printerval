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
import { cdnImageV2 } from '@util/cdnV2';
import { capitalize } from 'lodash';

interface IProps {
    item: Product;

    containerStyle?: StyleProp<ViewStyle>;
}
const HorizonCard = ({ item, containerStyle }: IProps) => {
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
        <Pressable style={[styles.container, containerStyle]} onPress={toDetail}>
            {!!discountText && (
                <View style={styles.discount}>
                    <TextNormal style={{ fontSize: 12, color: 'white', lineHeight: 16 }}>{discountText}</TextNormal>
                </View>
            )}
            <Pressable style={styles.favButton}>
                <Favorite width={13} height={13} />
            </Pressable>

            <FastImage style={styles.image} source={{ uri: cdnImageV2(item.image_url) }} resizeMode="cover" />

            <TextSemiBold style={styles.title} numberOfLines={1}>
                {capitalize(he.decode(item.name))}
            </TextSemiBold>
            <TextNormal style={styles.subTitle}>{'Sample Seller'}</TextNormal>

            <TextSemiBold style={styles.price}>
                {item.display_price} <TextNormal style={styles.oldPrice}>{item.display_high_price}</TextNormal>
            </TextSemiBold>
        </Pressable>
    );
};

export default memo(HorizonCard);
const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 220,
        marginRight: 16,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 12,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: lightColor.graybg,
    },
    discount: {
        width: 42,
        height: 23,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.price,
        position: 'absolute',
        zIndex: 100,
        top: 5,
        left: 5,
    },
    favButton: {
        width: 26,
        height: 26,
        borderWidth: 1.5,
        borderColor: lightColor.price,
        backgroundColor: '#fff',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        top: 4,
        right: 5,
    },
    title: {
        fontSize: 14,
        lineHeight: 17,
    },
    subTitle: {
        fontSize: 12,
        color: lightColor.grayout,
    },
    price: {
        color: lightColor.price,
        fontSize: 18,
    },
    oldPrice: { fontSize: 14, color: lightColor.grayout, textDecorationLine: 'line-through' },
});
