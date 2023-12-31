import { ExchangeLogo, ReportFlag } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import { ShippingInfo } from '@product/service/type';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { formatPrice } from '@util/index';
import { Product } from '@type/common';
import { navigate } from '@navigation/service';
import { useAppSelector } from '@store/hook';
import { getLocales } from 'react-native-localize';
import FastImage from 'react-native-fast-image';

interface IProps {
    country: string;
    data?: ShippingInfo;
    product: Product;
}
const DeliverySection = ({ data, country, product }: IProps) => {
    // debug trên chrome dùng getLocales sẽ bị crash !!
    // const locale = getLocales()[0].countryCode.toLowerCase();
    const locale = 'us';

    const renderTimeShipping = (defaultMinTime: number, defaultMaxTime: number) => {
        const minTime = moment().add(defaultMinTime, 'days').format('ll');
        const maxTime = moment().add(defaultMaxTime, 'days').format('ll');
        return minTime.split(',')[0] + ' - ' + maxTime.split(',')[0];
    };

    const toReportProduct = () => {
        navigate('ReportProduct', { product });
    };

    const toCreateTicket = () => {
        navigate('CreateTicket');
    };

    const toRefundPolicy = () => {
        navigate('BlogScreen', { postId: 650 }, 650);
    };

    const toExchangePolicy = () => {
        navigate('BlogScreen', { postId: 651 }, 651);
    };

    return (
        <View style={styles.container}>
            {!!data && (
                <View style={styles.section}>
                    <FastImage style={styles.iconLeft} source={{ uri: `https://flagcdn.com/48x36/${locale}.png` }} />
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <TextSemiBold style={{ color: '#444', fontSize: 15 }}>Delivery</TextSemiBold>
                        {Object.entries(data).map(item => (
                            <TextNormal key={item[0]} style={{ fontSize: 13 }}>
                                {`${formatPrice(item[1].shipping_fee)} ${
                                    item[1].name_shipping
                                } between ${renderTimeShipping(item[1].default_min_time, item[1].default_max_time)}`}
                            </TextNormal>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <ExchangeLogo width={22} height={22} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <TextSemiBold style={{ color: '#444', fontSize: 15 }}>Policies</TextSemiBold>
                    <TextNormal style={{ fontSize: 13 }}>
                        Elgible for{' '}
                        <TextNormal style={{ color: lightColor.secondary, fontSize: 13 }} onPress={toRefundPolicy}>
                            Refund
                        </TextNormal>
                        {` or `}
                        <TextNormal style={{ color: lightColor.secondary, fontSize: 13 }} onPress={toExchangePolicy}>
                            Return and Replacement
                        </TextNormal>
                        {'\n'}within 30 days from the date of delivery
                    </TextNormal>
                </View>
            </View>

            <View style={styles.section}>
                <ReportFlag width={22} height={22} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Pressable onPress={toCreateTicket} hitSlop={8}>
                        <TextSemiBold style={{ color: '#444', fontSize: 15 }}>Report Content</TextSemiBold>
                        <TextNormal style={{ fontSize: 13 }}>
                            Having trouble?{' '}
                            <TextNormal style={{ color: lightColor.secondary, fontSize: 13 }}>
                                Submit a ticket
                            </TextNormal>
                            {` and we will get back to you!`}
                        </TextNormal>
                    </Pressable>

                    <Pressable onPress={toReportProduct} hitSlop={8}>
                        <TextNormal style={{ fontSize: 13 }}>
                            If you want to report this product,{' '}
                            <TextNormal style={{ color: lightColor.secondary, fontSize: 13 }}>click here</TextNormal>
                        </TextNormal>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default memo(DeliverySection);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
        paddingHorizontal: 18,

        borderTopWidth: 1,
        borderTopColor: '#F1F1F1',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    iconLeft: {
        width: 24,
        height: 18,
    },
});
