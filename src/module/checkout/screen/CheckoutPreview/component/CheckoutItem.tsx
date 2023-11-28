import { lightColor } from '@styles/color';
import { CartItem } from '@type/common';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { cdnImageV2 } from '@util/cdnV2';
import { TextNormal, TextSemiBold } from '@components/text';
import he from 'he';
import { DESIGN_RATIO, formatPrice, primitiveObj } from '@util/index';
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

    const customText = useMemo(() => {
        if (!item.configurations) return '';

        const configObj = primitiveObj(JSON.parse(item.configurations));
        const { buy_design, design_fee, previewUrl, ...config } = configObj || {};

        const text = Object.entries(config)
            .map(([key, value]) => {
                if (key == 'print_location') return `Print location: ${value}`;
                return `${key}: ${value}`;
            })
            .join('; ');
        return text;
    }, [item]);

    return (
        <View style={{ width: '100%', marginTop: 16, flexDirection: 'row' }}>
            <FastImage style={styles.img} source={{ uri: cdnImageV2(item.image_url) }} resizeMode="cover" />

            <View style={{ flex: 1, paddingLeft: 12 }}>
                <TextNormal style={styles.textTitle} numberOfLines={2}>
                    {he.decode(productName)}
                </TextNormal>

                <TextNormal style={styles.textVariant}>{nameVariant}</TextNormal>

                {!!customText && <TextNormal style={styles.textVariant}>{customText}</TextNormal>}

                <TextNormal style={styles.textQty}>Qty: {item.quantity}</TextNormal>

                <TextNormal style={styles.textPrice}>
                    {formatPrice(item.price)}{' '}
                    {Number(item.high_price) > 0 && (
                        <TextNormal style={styles.textOldprice}>{formatPrice(item.high_price)}</TextNormal>
                    )}
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
    textVariant: { fontSize: 13, color: '#999', lineHeight: 17, marginTop: 4 },
    textQty: { fontSize: 13, color: '#444', lineHeight: 16, marginTop: 6 },
    textPrice: { fontSize: 13, color: lightColor.price, lineHeight: 16, marginTop: 6 },
    textOldprice: { fontSize: 13, color: lightColor.grayout, lineHeight: 16, textDecorationLine: 'line-through' },
});
