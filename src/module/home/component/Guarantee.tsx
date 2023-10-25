import { TextNormal, TextSemiBold } from '@components/text';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const LIST = [
    {
        title: 'Exchange',
        content:
            'If your item doesn’t fit perfectly and requires significant adjustments, we will correct and remake your item free of charge, at no extra cost.',
        bg: '#FDEDEC',
        img: require('@image/Guarantee1.png'),
    },
    {
        title: 'Refund',
        content:
            'Something wrong with your item? Contact our Support team. Our well-trained and friendly Support Team is available via email and hotline to help you fix this case directly.',
        bg: '#C6F8CB',
        img: require('@image/Guarantee2.png'),
    },
    {
        title: 'Pre- or post-purchase',
        content:
            'At Printerval, we put the customer first because we ensure the quality of the customer experience. Feel free to contact us here, we are always available to assist with your case.',
        bg: '#D1EEFF',
        img: require('@image/Guarantee3.png'),
    },
];

const Guarantee = () => {
    return (
        <View style={{ width: '100%', marginTop: 32, alignItems: 'center' }}>
            <TextSemiBold style={{ fontSize: 20 }}> Our Perfect Fit Guarantee</TextSemiBold>
            <TextNormal style={{ color: '#222', fontSize: 15, marginTop: 8 }}>Complimentary On All Orders</TextNormal>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {LIST.map(item => (
                    <View style={[styles.item, { backgroundColor: item.bg }]} key={item.title}>
                        <FastImage style={styles.image} source={item.img} />
                        <TextSemiBold style={styles.itemTitle}>{item.title}</TextSemiBold>
                        <TextNormal style={styles.itemContent}>{item.content}</TextNormal>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default memo(Guarantee);

const styles = StyleSheet.create({
    scroll: { width: '100%', height: 310, marginTop: 7 },
    item: {
        width: (250 * SCREEN_WIDTH) / 375,
        height: 255,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginLeft: 12,
        marginTop: 55,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: -50,
        zIndex: 100,
    },
    itemTitle: { fontSize: 15, marginTop: 5 },
    itemContent: { fontSize: 14, marginTop: 5, letterSpacing: 0.1 },
});
