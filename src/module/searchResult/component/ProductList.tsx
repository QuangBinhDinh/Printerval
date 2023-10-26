import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProductFilterArgs } from '@searchResult/service';
import { splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { FilterIcon } from '@assets/svg';
import SubCategory from './SubCategory';
import { useScrollReachEnd } from '@components/hooks/useScrollReachEnd';
import LoadingMore from './LoadingMore';
import { navigate } from '@navigation/service';

const ProductList = memo(
    ({
        data,
        meta,
        sub,
        loadMore,
        filter,
        priceRange,
        currentFilter,
        setFilter,
    }: {
        data: any;
        meta: any;
        sub: any;
        loadMore: any;
        filter: any;
        priceRange: any;
        currentFilter: Partial<ProductFilterArgs>;
        setFilter: any;
    }) => {
        const { onEndReached } = useScrollReachEnd();
        const toFilter = () => {
            navigate('FilterScreen', { filter, priceRange, currentFilter, setFilter });
        };

        if (!data) return null;
        return (
            <ScrollView
                style={{ flex: 1 }}
                onScroll={({ nativeEvent }) => {
                    onEndReached(nativeEvent, loadMore);
                }}
                removeClippedSubviews
            >
                <View style={{ height: 16 }} />
                <SubCategory data={sub} />

                <View style={styles.rowFilter}>
                    <TextNormal style={{ fontSize: 15 }}>About {meta.total_count} results</TextNormal>
                    <Pressable style={styles.filterButton} onPress={toFilter}>
                        <FilterIcon width={20} height={20} />
                    </Pressable>
                </View>

                <ListData data={data} />
                {meta?.has_next && <LoadingMore />}
            </ScrollView>
        );
    },
);

const ListData = memo(({ data }: { data: any[] }) => {
    const newData = splitColArray(data);
    // console.log('Result', data);
    if (!newData) return null;
    return (
        <View style={styles.productList}>
            {newData.map((col, index) => (
                <View key={index} style={[{ width: '48%' }]}>
                    {col.map(item => (
                        <DynamicCard item={item} key={item.id} />
                    ))}
                </View>
            ))}
        </View>
    );
});

export default memo(ProductList);
const styles = StyleSheet.create({
    rowFilter: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    filterButton: {
        width: 38,
        height: 38,
        backgroundColor: lightColor.graybg,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productList: { width: '100%', flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between' },
});
