import HeaderScreen from '@components/HeaderScreen';
import { TextSemiBold, TextNormal } from '@components/text';
import { OrderDetailRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { lightColor } from '@styles/color';
import { useTrackingOrderQuery } from '@user/service';
import { formatPrice, primitiveObj } from '@util/index';
import React, { memo, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { OrderProduct } from '@user/type';
import { cdnImageV2 } from '@util/cdnV2';
import FastImage from 'react-native-fast-image';

const OrderDetail = () => {
    const {
        params: { email, orderCode, status },
    } = useRoute<OrderDetailRouteProp>();

    const { data, isLoading } = useTrackingOrderQuery({ email, orderId: orderCode });
    const { amount, items, order } = data || {};

    console.log('data', data);

    const billingAddressText = useMemo(() => {
        let text = '';

        if (order) {
            text = text + order.billingAddress.country.nicename + ', ';
            if (order.state_name) text = text + order.billingAddress.state_name + ', ';
            text = text + order.billingAddress.city_name + ', ' + order.billingAddress.address;
        }

        return text;
    }, [order]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={`Order: ${orderCode}`} />

            {!!order && (
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} removeClippedSubviews>
                    <View style={[styles.statusRow, { backgroundColor: colorStatus(status) }]}>
                        <TextSemiBold style={{ color: 'white' }}>{statusText(status)}</TextSemiBold>
                        <Image style={{ width: 40, height: 40 }} source={iconStatus(status)} />
                    </View>

                    <View style={styles.header}>
                        <TextSemiBold style={{ fontSize: 15, color: lightColor.secondary }}>{orderCode}</TextSemiBold>
                        <TextNormal style={{ fontSize: 13 }}>{order.created_at}</TextNormal>
                    </View>

                    {items?.map(item => (
                        <OrderProductCard item={item} key={item.id} />
                    ))}
                    <View style={{ height: 8 }} />

                    <View style={styles.sectionGray}>
                        <View style={styles.sectionTitleRow}>
                            <Image
                                style={{ width: 25, height: 25 }}
                                source={require('@image/Order/order-billing.png')}
                            />
                            <TextSemiBold style={styles.sectionTitle}>Billing info</TextSemiBold>
                        </View>
                        <TextSemiBold style={{ color: lightColor.secondary }}>{order.billingAddress.name}</TextSemiBold>
                        <TextNormal style={{ lineHeight: 21, marginTop: 3 }}>{billingAddressText}</TextNormal>
                    </View>

                    <View style={styles.sectionGray}>
                        <View style={styles.sectionTitleRow}>
                            <Image
                                style={{ width: 25, height: 25 }}
                                source={require('@image/Order/order-shipping.png')}
                            />
                            <TextSemiBold style={styles.sectionTitle}>Shipping info</TextSemiBold>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const OrderProductCard = memo(({ item }: { item: OrderProduct }) => {
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

    return (
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
    );
});

export default OrderDetail;

const styles = StyleSheet.create({
    statusRow: {
        height: 58,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },

    header: {
        width: '100%',
        height: 40,
        backgroundColor: lightColor.lightbg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    rowProduct: {
        flexDirection: 'row',
        marginTop: 12,
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

    sectionGray: {
        width: '100%',
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: lightColor.lightbg,
    },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },

    sectionTitle: {
        marginLeft: 6,
        fontSize: 18,
        lineHeight: 22,
        marginTop: 4,
    },
});

const orderStatusType = (status: string) => {
    if (['PENDING', 'PROCESSING', 'ISSUED'].includes(status)) return 'pending';
    if (['DELIVERING', 'READY_TO_SHIP'].includes(status)) return 'delivering';
    if (status == 'FINISHED') return 'finish';
    if (['CANCELED', 'REQUEST_RETURN', 'RETURNED'].includes(status)) return 'cancel';

    return '';
};

const statusText = (orderCode: string) => {
    let text = '';
    switch (orderStatusType(orderCode)) {
        case 'pending':
            text = 'Your order is processing';
            break;
        case 'delivering':
            text = 'Your order is on the way';
            break;
        case 'finish':
            text = 'Your order has been completed';
            break;
        case 'cancel':
            text = 'Your order has been canceled';
            break;
        default:
            break;
    }

    return text;
};

const colorStatus = (orderCode: string) => {
    let color = 'white';
    switch (orderStatusType(orderCode)) {
        case 'pending':
            color = 'rgba(41, 136, 32, 0.7)';
            break;
        case 'delivering':
            color = 'rgba(52, 169, 42, 0.7)';
            break;
        case 'finish':
            color = 'rgba(34, 113, 186, 0.7)';
            break;
        case 'cancel':
            color = 'rgba(210, 58, 48, 0.7)';
            break;
        default:
            break;
    }
    return color;
};

const iconStatus = (orderCode: string) => {
    let path = require('@assets/image/Order/order-pending.png');

    switch (orderStatusType(orderCode)) {
        case 'delivering':
            path = require('@assets/image/Order/order-delivering.png');
            break;
        case 'finish':
            path = require('@assets/image/Order/order-finish.png');
            break;
        case 'cancel':
            path = require('@assets/image/Order/order-cancel.png');
            break;
        default:
            break;
    }
    return path;
};
