import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH, randomizeColor } from '@util/index';
import React, { memo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

//follow figma design width
const CARD_WIDTH = (SCREEN_WIDTH * 320) / 375;

const PopularDesign = () => {
    const renderItem = ({ item }: { item: any }) => <DesignItem item={item} />;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 16, lineHeight: 28 }}>Popular Designs</TextSemiBold>
            <FlatList
                data={[1, 2, 3, 4]}
                style={{ width: '100%', marginTop: 16 }}
                renderItem={renderItem}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
};

export default memo(PopularDesign);

const DesignItem = ({ item }: { item: any }) => {
    const colors = randomizeColor();
    return (
        <View style={styles.item}>
            <Pressable style={styles.image}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, backgroundColor: colors[0] }}></View>
                    <View style={{ flex: 1, backgroundColor: colors[1] }}></View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, backgroundColor: colors[2] }}></View>
                    <View style={{ flex: 1, backgroundColor: colors[3] }}></View>
                </View>
            </Pressable>

            <TextSemiBold style={styles.title}>Same Title</TextSemiBold>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
    },
    item: {
        width: CARD_WIDTH,
        height: CARD_WIDTH + 40,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 6,
        overflow: 'hidden',
        //borderWidth: 1,
    },
    title: {
        fontSize: 18,
        color: lightColor.secondary,
        alignSelf: 'center',
        lineHeight: 22,
    },
});
