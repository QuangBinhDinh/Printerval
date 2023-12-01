import HeaderScreen from '@components/HeaderScreen';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadow } from '@styles/shadow';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const TEST = [
    {
        id: 1,
        title: 'Good morning! Get 20% Voucher',
        content: 'Summer sale up to 20% off. Limited voucher. Get now!! 😜',
    },
    {
        id: 2,
        title: 'Special offer just for you',
        content: 'New Autumn Collection 30% off',
    },
    {
        id: 3,
        title: 'Holiday sale 50%',
        content: 'Tap here to get 50% voucher.',
    },
    {
        id: 4,
        title: 'Holiday sale 50%',
        content: 'Tap here to get 50% voucher.',
    },
    {
        id: 5,
        title: 'Holiday sale 50%',
        content: 'Tap here to get 50% voucher.',
    },
    {
        id: 6,
        title: 'Holiday sale 50%',
        content: 'Tap here to get 50% voucher.',
    },
];

const NotficationScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Notification" />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24 }}>
                {TEST.map((item, index) => (
                    <Pressable
                        style={[styles.card, index == 0 && [shadow, { backgroundColor: 'white' }]]}
                        key={item.id}
                    >
                        <TextSemiBold
                            style={{ color: index == 0 ? lightColor.secondary : '#444', lineHeight: 21 }}
                            numberOfLines={1}
                        >
                            {item.title}
                        </TextSemiBold>
                        <TextNormal style={{ color: lightColor.grayout, lineHeight: 21, marginTop: 5 }}>
                            {item.content}
                        </TextNormal>
                    </Pressable>
                ))}
                <View style={{ height: 70 }} />
            </ScrollView>
        </View>
    );
};

export default NotficationScreen;

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 16,
        backgroundColor: lightColor.graybg,
        borderRadius: 6,
        marginTop: 18,
    },
});
