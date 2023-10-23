import { TextNormal, TextSemiBold } from '@components/text';
import React, { memo } from 'react';
import { Platform, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';

const TrendExplore = () => {
    const renderItem = ({ item }: { item: any }) => <TrendItem item={item} />;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 16, lineHeight: 28 }}>Explore by trends</TextSemiBold>
            <FlatList
                style={styles.list}
                data={[1, 2, 3, 4, 5]}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
};

const TrendItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
        <FastImage style={styles.image} />
        <TextNormal style={styles.itemTitle}>Sample Test Text </TextNormal>
    </View>
);

export default memo(TrendExplore);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        width: '100%',
    },
    list: {
        marginTop: 16,
        width: '100%',
        height: 150,
        //borderWidth: 1,
    },
    item: { height: 150, width: 100, marginLeft: 12, alignItems: 'center' },
    image: { width: 100, height: 100, borderRadius: 50, borderWidth: 1 },
    itemTitle: { fontSize: 16, marginTop: 10, width: '90%', textAlign: 'center', lineHeight: 18 },
});
