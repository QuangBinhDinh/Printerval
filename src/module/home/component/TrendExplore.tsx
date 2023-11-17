import { TextNormal, TextSemiBold } from '@components/text';
import React, { memo } from 'react';
import { Platform, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import { RANDOM_IMAGE_URL } from '../../../constant';
import { ExploreTag } from '@home/service';

const TrendExplore = ({ data }: { data: ExploreTag[] }) => {
    const renderItem = ({ item }: { item: ExploreTag }) => <TrendItem item={item} />;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 20, marginLeft: 16, lineHeight: 26 }}>Explore by trends</TextSemiBold>
            <FlatList
                style={styles.list}
                data={data}
                contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
};

const TrendItem = ({ item }: { item: ExploreTag }) => (
    <View style={styles.item}>
        <FastImage style={styles.image} source={{ uri: item.image_url }} />
        <TextNormal style={styles.itemTitle}>{item.tag_name}</TextNormal>
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
    image: { width: 100, height: 100, borderRadius: 50 },
    itemTitle: { fontSize: 13.5, marginTop: 10, width: '100%', textAlign: 'center', lineHeight: 18 },
});
