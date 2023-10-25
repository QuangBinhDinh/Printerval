import HeaderScreen from '@components/HeaderScreen';
import { SearchResultRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, NativeScrollEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProductFilterArgs, useFetchProductResultQuery } from './service';
import { SCREEN_WIDTH, splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { FilterIcon } from '@assets/svg';
import SubCategory from './component/SubCategory';
import { useScrollReachEnd } from '@components/hooks/useScrollReachEnd';
import LoadingResult from './component/LoadingResult';
import LoadingMore from './component/LoadingMore';

const SearchResult = () => {
    const {
        params: { keyword, categoryId, title },
    } = useRoute<SearchResultRouteProp>();

    const [searchFilter, setFilter] = useState<Partial<ProductFilterArgs>>({
        id: categoryId,
        category_id: categoryId,
        q: keyword,
        // dt: Date.now(),
    });
    //nest destructing with possible undefined value
    const { data: { result, filterOptions, priceRange, categories, meta } = {}, isLoading } =
        useFetchProductResultQuery(searchFilter);

    const loadMore = useCallback(() => {
        if (meta?.has_next) {
            setFilter(prev => ({ ...prev, page_id: meta?.page_id ? Number(meta.page_id) + 1 : 1 }));
        }
    }, [meta]);

    // useEffect(() => {
    //     console.log('Meta', meta);
    // }, [meta]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={title} />
            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <LoadingResult />
                ) : (
                    <ProductList data={result} meta={meta} sub={categories} loadMore={loadMore} />
                )}
            </View>
        </View>
    );
};

export default SearchResult;

const ProductList = ({ data, meta, sub, loadMore }: { data: any; meta: any; sub: any; loadMore: any }) => {
    const { onEndReached } = useScrollReachEnd();

    const newData = splitColArray(data);
    if (!newData) return null;
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
                <Pressable style={styles.filterButton}>
                    <FilterIcon width={20} height={20} />
                </Pressable>
            </View>

            <View style={styles.productList}>
                {newData.map((col, index) => (
                    <View key={index} style={[{ width: '48%' }]}>
                        {col.map((item, i) => (
                            <DynamicCard item={item} key={item.id} />
                        ))}
                    </View>
                ))}
            </View>
            {meta?.has_next && <LoadingMore />}
        </ScrollView>
    );
};

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
