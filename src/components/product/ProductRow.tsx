import { TextSemiBold } from '@components/text';
import { Product } from '@type/common';
import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import HorizonCard from './HorizonCard';

interface IProps {
    title: string;
    data?: Product[];
}

const ProductRow = ({ title, data }: IProps) => {
    const renderItem = ({ item }: { item: Product }) => <HorizonCard item={item} />;

    if (!data || data.length == 0) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={styles.title}>{title}</TextSemiBold>
            <FlatList
                style={{ width: '100%', height: 221 }}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={renderItem}
            />
        </View>
    );
};

export default memo(ProductRow);

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
