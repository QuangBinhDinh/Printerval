import { TextNormal, TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { lightColor } from '@styles/color';
import { OrderItemResponse, OrderProduct } from '@user/type';
import { cdnImageV2 } from '@util/cdnV2';
import { formatPrice, primitiveObj } from '@util/index';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const OrderItem = ({ data }: { data: OrderItemResponse }) => {
    const item = data.items[0];

    const nameVariant = useMemo(() => {
        let name = '';
        var commaIndex = item.name.indexOf(',');
        if (commaIndex != -1) {
            name = item.name.slice(commaIndex + 1);
        }
        return name.trim();
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

        return text.trim();
    }, [item]);

    const toDetailOrder = () => {
        //console.log(data);
        navigate('OrderDetail', { email: data?.customer?.email, orderCode: data.code, status: data.status }, data.code);
    };

    return (
        <View style={{ width: '100%' }}>
            <View style={styles.header}>
                <TextSemiBold style={{ fontSize: 15, color: lightColor.secondary }}>{data.code}</TextSemiBold>
                <TextNormal style={{ fontSize: 13 }}>{data.created_at}</TextNormal>
            </View>

            <View style={styles.content}>
                <Pressable style={styles.rowProduct}>
                    <FastImage style={styles.image} resizeMode="cover" source={{ uri: cdnImageV2(item.image_url) }} />

                    <View style={{ flex: 1, paddingLeft: 14 }}>
                        <TextNormal style={styles.title} numberOfLines={2}>
                            {item.name}
                        </TextNormal>

                        <TextNormal style={styles.textGray}>{nameVariant}</TextNormal>
                        {!!customText && <TextNormal style={styles.textGray}>{customText}</TextNormal>}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 3,
                            }}
                        >
                            <TextNormal style={[styles.textGray, { color: lightColor.price }]}>
                                {formatPrice(item.price)}
                            </TextNormal>
                            <TextNormal style={[styles.textGray, { color: '#444' }]}>x{item.quantity}</TextNormal>
                        </View>
                    </View>
                </Pressable>

                <Pressable style={styles.moreProd} hitSlop={8} onPress={toDetailOrder}>
                    <TextNormal style={{ fontSize: 13 }}>View more products</TextNormal>
                </Pressable>

                <View style={styles.amountRow}>
                    <TextNormal style={{ fontSize: 15 }}>Amount</TextNormal>
                    <TextSemiBold style={{ color: lightColor.price }}>{formatPrice(data.amount)}</TextSemiBold>
                </View>

                <View style={styles.bottomRow}>
                    <TextNormal style={{ color: data.status == 'CANCELED' ? lightColor.error : lightColor.success }}>
                        {data.status}
                    </TextNormal>
                    <Pressable style={styles.detailButton} hitSlop={10} onPress={toDetailOrder}>
                        <TextNormal style={{ color: 'white', marginTop: 2 }}>Detail</TextNormal>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default memo(OrderItem);

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 40,
        backgroundColor: lightColor.lightbg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    content: {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: 24,
    },
    rowProduct: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
        paddingVertical: 10,
        width: '100%',
        paddingHorizontal: 18,
    },
    image: {
        backgroundColor: lightColor.lightbg,
        width: 100,
        height: 100,
        borderRadius: 6,
    },
    title: {
        color: lightColor.primary,
        lineHeight: 20,
        width: '90%',
    },
    textGray: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 16.5,
        color: lightColor.grayout,
    },

    moreProd: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
    },
    amountRow: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
    },

    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 18,
    },
    detailButton: {
        width: 96,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: lightColor.secondary,
    },
});
