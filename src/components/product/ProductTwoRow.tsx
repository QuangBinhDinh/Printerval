import { TextSemiBold } from '@components/text';
import { Product } from '@type/common';
import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import HorizonCard from './HorizonCard';
import { splitRowArray } from '@util/index';

interface IProps {
    title: string;
    data?: Product[];
}

const ProductTwoRow = ({ title, data }: IProps) => {
    const renderItem = ({ item }: { item: Product[] }) => (
        <View>
            <HorizonCard item={item[0]} />
            <HorizonCard item={item[1]} containerStyle={{ marginTop: 12 }} />
        </View>
    );
    const newData = splitRowArray(data);

    if (!data || data.length == 0) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={styles.title}>{title}</TextSemiBold>
            <FlatList
                style={{ width: '100%', height: 221 }}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={newData}
                renderItem={renderItem}
            />
        </View>
    );
};

export default memo(ProductTwoRow);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        width: '100%',
    },
    title: {
        fontSize: 20,
        marginLeft: 18,
        lineHeight: 24,
        marginBottom: 14,
    },
});
