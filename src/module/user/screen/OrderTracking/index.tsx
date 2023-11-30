import HeaderScreen from '@components/HeaderScreen';
import { TextNormal, TextSemiBold } from '@components/text';
import { OrderTrackingRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { shadow } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STATE_LIST = [
    {
        title: 'Parcel is successfully delivered',
        timestamp: 'Jul 20. 10:20',
        completed: true,
    },
    {
        title: 'Parcel is out for delivery',
        timestamp: 'Jul 20. 10:20',
        completed: true,
    },
    {
        title: 'Parcel is successfully delivered',
        timestamp: 'Jul 20. 10:20',
        completed: false,
    },
    {
        title: 'Parcel is received at delivery Branch',
        timestamp: 'Jul 20. 10:20',
        completed: false,
    },
    {
        title: 'Parcel is in transit',
        timestamp: 'Jul 20. 10:20',
        completed: false,
    },
    {
        title: 'Sender has shipped your parcel',
        timestamp: 'Jul 20. 10:20',
        completed: false,
    },
    {
        title: 'Sender is preparing to ship your order',
        timestamp: 'Jul 20. 10:20',
        completed: false,
    },
];
const OrderTracking = () => {
    const insets = useSafeAreaInsets();
    const {
        params: { prodImg, orderCode, timestamp },
    } = useRoute<OrderTrackingRouteProp>();

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Tracking order" />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18 }}>
                <View style={[styles.header, shadow]}>
                    <FastImage style={styles.img} source={{ uri: prodImg }} />

                    <View style={{ flex: 1, height: '100%', paddingLeft: 12, justifyContent: 'space-between' }}>
                        <TextNormal>
                            Tracking Number:{' '}
                            <TextSemiBold style={{ color: lightColor.secondary }}>{orderCode}</TextSemiBold>
                        </TextNormal>
                        <TextNormal style={{ fontSize: 13 }}>Delivery on {timestamp}</TextNormal>
                    </View>
                </View>

                <View style={{ height: 32 }} />

                {STATE_LIST.map((item, index) => (
                    <View key={item.title} style={styles.rowStatus}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 14, alignItems: 'center' }}>
                                <View style={styles.icon}>
                                    <View style={styles.iconInner}>
                                        {item.completed && <Icon type="feather" name="check" size={8} color="white" />}
                                    </View>
                                </View>
                                {index < STATE_LIST.length - 1 && <View style={styles.line}></View>}
                            </View>
                            <TextNormal style={[styles.textStatus, !item.completed && { color: lightColor.grayout }]}>
                                {item.title}
                            </TextNormal>
                        </View>

                        <TextNormal style={[styles.textTime, !item.completed && { color: lightColor.grayout }]}>
                            {item.timestamp}
                        </TextNormal>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default OrderTracking;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 70,
        marginTop: 24,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 100,
    },
    img: { width: 50, height: 50, borderRadius: 6, backgroundColor: '#999' },

    textStatus: {
        fontSize: 13,
        lineHeight: 16,
        width: SCREEN_WIDTH / 2,
        marginLeft: 16,
    },
    textTime: {
        fontSize: 13,
        lineHeight: 16,
    },
    rowStatus: {
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    line: {
        width: 1,
        backgroundColor: lightColor.graybg,
        height: 46,
    },
    icon: {
        height: 16,
        width: 16,
        borderRadius: 16,
        borderColor: lightColor.success,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    iconInner: {
        height: 10,
        width: 10,
        borderRadius: 10,
        backgroundColor: lightColor.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
