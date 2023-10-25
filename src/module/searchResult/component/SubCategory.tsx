import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { cdnImage } from '@util/cdnImage';
import React, { memo } from 'react';
import { Platform, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';

const SubCategory = ({ data }: { data: any }) => {
    const renderItem = ({ item }: { item: any }) => <SubItem item={item} />;

    if (!data || data.length == 0) return null;
    return (
        <View style={styles.container}>
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

const SubItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
        <FastImage style={styles.image} source={{ uri: cdnImage(item.image_url, 250, 250) }} />
        <TextNormal style={styles.itemTitle} numberOfLines={2}>
            {item.name}
        </TextNormal>
    </View>
);

export default memo(SubCategory);

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        width: '100%',
    },
    list: {
        marginTop: 16,
        width: '100%',
        height: 150,
        //borderWidth: 1,
    },
    item: { height: 150, width: 100, marginLeft: 12, alignItems: 'center' },
    image: { width: 100, height: 100, borderRadius: 50, backgroundColor: lightColor.graybg },
    itemTitle: { fontSize: 14, marginTop: 10, width: '100%', textAlign: 'center', lineHeight: 18 },
});
