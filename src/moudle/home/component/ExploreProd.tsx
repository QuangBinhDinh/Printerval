import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextSemiBold } from '@components/text';
import { splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';

const ExploreProd = ({ data }: { data: any[] }) => {
    const newData = splitColArray(data);

    if (!newData) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 12 }}>Explore by trends</TextSemiBold>
            <View style={styles.list}>
                {newData.map((col, index) => (
                    <View key={index} style={[{ width: '48%' }]}>
                        {col.map((item, i) => (
                            <DynamicCard item={item} key={item.id} style={{ marginTop: i == 0 ? 18 : 24 }} />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default memo(ExploreProd);

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: '100%',
    },
    list: { width: '100%', flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between' },
});
