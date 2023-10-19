import React, { forwardRef, memo, useCallback, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductFilterArgs, useFetchProductResultQuery } from './service';
import { SCREEN_WIDTH } from '@util/index';
import LoadMoreProd from '@components/loading/LoadMoreProd';
import LoadListProd from '@components/loading/LoadListProd';
import FastImage from 'react-native-fast-image';

const SAMPLE_1 = {
    id: '54',
    category_id: '54',
    maxPrice: 36,
    minPrice: 27,
    order: 'low_price',
    dt: Date.now(),
};
const SAMPLE_2 = {
    id: '7',
    category_id: '7',
    maxPrice: 27,
    minPrice: 18,
    order: 'sold',
    dt: Date.now(),
};
const ProductListScreen = () => {
    const listRef = useRef<FlatList>(null);
    const [filter, setFilter] = useState<Partial<ProductFilterArgs>>({
        id: '54',
        category_id: '54',
    });
    const { data, isFetching } = useFetchProductResultQuery(filter);
    const hasNext = data?.meta?.has_next;

    const displayLoading = isFetching && !filter.page_id; // hiển thị loading skeleton mỗi khi filter thay đổi

    const callFirstDataSet = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        setFilter(SAMPLE_1);
    };
    const callSecondDataSet = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
        setFilter(SAMPLE_2);
    };

    const loadMore = useCallback(() => {
        if (hasNext) setFilter(prev => ({ ...prev, page_id: prev.page_id ? prev.page_id + 1 : 1 }));
    }, [hasNext]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <View style={styles.headerList}>
                <TouchableOpacity style={styles.filterButton} onPress={callFirstDataSet} disabled={isFetching}>
                    <Text style={{ fontSize: 16, color: 'white' }}>Filter 1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={callSecondDataSet} disabled={isFetching}>
                    <Text style={{ fontSize: 16, color: 'white' }}>Filter 2</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <ListProd data={data?.result} loadMore={loadMore} hasNext={hasNext} ref={listRef} />
                {displayLoading && <LoadListProd />}
            </View>
        </View>
    );
};

//tách data trả về thành 1 component riêng vì query hook ở trên có thể render nhiều lần
const ListProd = memo(
    forwardRef(({ data, loadMore, hasNext }: { data: any[]; loadMore: any; hasNext: boolean }, ref) => {
        const renderItem = ({ item }: { item: any }) => (
            <View style={styles.productButton}>
                <FastImage style={{ width: '100%', aspectRatio: 1 }} source={{ uri: item.image_url }} />
                <Text style={{ fontSize: 20, color: 'red', marginTop: 10, fontWeight: '700' }}>{item.price}</Text>
            </View>
        );
        const NoMoreResult = () => <View style={{ height: 75 }}></View>;

        if (!data) return null;
        return (
            <FlatList
                ref={ref}
                data={data}
                renderItem={renderItem}
                style={{ flex: 1 }}
                numColumns={2}
                //showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.id + index}
                showsHorizontalScrollIndicator={false}
                columnWrapperStyle={{ width: '100%', justifyContent: 'space-between', marginTop: 14 }}
                contentContainerStyle={{ paddingHorizontal: 10, width: SCREEN_WIDTH }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={hasNext ? LoadMoreProd : NoMoreResult}
            />
        );
    }),
);

export default ProductListScreen;
const styles = StyleSheet.create({
    headerList: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 110,
        marginTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
    },
    filterButton: {
        backgroundColor: '#2792ce',
        height: 70,
        width: 150,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },

    productButton: {
        width: '47%',
        height: 230,
        // borderWidth: 1,
    },

    footer: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
