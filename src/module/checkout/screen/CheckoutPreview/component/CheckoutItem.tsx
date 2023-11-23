import { lightColor } from '@styles/color';
import { CartItem } from '@type/common';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { cdnImageV2 } from '@util/cdnV2';
import { TextNormal, TextSemiBold } from '@components/text';
import he from 'he';
import { DESIGN_RATIO, formatPrice } from '@util/index';
import { normalize } from '@rneui/themed';

const CheckoutItem = ({ item }: { item: CartItem }) => {
    const productName = useMemo(() => {
        if (!item.name_variant) return item.product_name;
        return item.product_name.substring(0, item.product_name.indexOf(item.name_variant) - 2);
    }, [item]);

    const nameVariant = useMemo(() => {
        let name = '';
        if (item.name_variant) name = item.name_variant;
        else {
            var commaIndex = item.product_name.indexOf(',');
            if (commaIndex != -1) {
                name = item.product_name.slice(commaIndex + 1);
            }
        }

        return name;
    }, [item]);

    return (
        <View style={{ width: '100%', marginTop: 16, flexDirection: 'row' }}>
            <FastImage style={styles.img} source={{ uri: cdnImageV2(item.image_url) }} resizeMode="cover" />

            <View style={{ flex: 1, paddingLeft: 12 }}>
                <TextNormal style={styles.textTitle} numberOfLines={2}>
                    {he.decode(productName)}
                </TextNormal>
                <TextNormal style={styles.textVariant}>{nameVariant}</TextNormal>
                <TextNormal style={styles.textQty}>Qty: {item.quantity}</TextNormal>
                <TextNormal style={styles.textPrice}>
                    {formatPrice(item.price)}{' '}
                    <TextNormal style={{ color: lightColor.grayout, textDecorationLine: 'line-through' }}></TextNormal>
                </TextNormal>
            </View>
        </View>
    );
};

export default memo(CheckoutItem);

const styles = StyleSheet.create({
    img: {
        width: normalize(90),
        height: normalize(90),
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: lightColor.lightbg,
    },
    textTitle: { color: lightColor.primary, lineHeight: 16, fontSize: 13 },
    textVariant: { fontSize: 13, color: '#999', lineHeight: 16, marginTop: 4 },
    textQty: { fontSize: 13, color: '#444', lineHeight: 16, marginTop: 4 },
    textPrice: { fontSize: 13, color: lightColor.price, lineHeight: 16, marginTop: 4 },
});
