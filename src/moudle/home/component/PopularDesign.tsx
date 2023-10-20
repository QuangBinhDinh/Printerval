import { TextSemiBold } from '@components/text';
import { randomizeColor } from '@util/index';
import React, { memo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PopularDesign = () => {
    const renderItem = ({ item }: { item: any }) => <DesignItem item={item} />;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 16 }}>Popular Designs</TextSemiBold>
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
        <Pressable style={styles.item}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: colors[0] }}></View>
                <View style={{ flex: 1, backgroundColor: colors[1] }}></View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: colors[2] }}></View>
                <View style={{ flex: 1, backgroundColor: colors[3] }}></View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
    },
    item: {
        width: 320,
        height: 320,
        borderRadius: 6,
        marginLeft: 12,
        overflow: 'hidden',
        //borderWidth: 1,
    },
});
