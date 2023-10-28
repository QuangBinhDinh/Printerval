import React, { memo, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProductFilterArgs } from '@searchResult/service';
import { SCREEN_WIDTH, splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { FilterIcon } from '@assets/svg';
import { useScrollReachEnd } from '@components/hooks/useScrollReachEnd';
import LoadingMore from './LoadingMore';
import { navigate } from '@navigation/service';
import EmptyResult from './EmptyResult';

interface IProps {
    /**
     * List product trả về
     */
    data: any;

    /**
     * Chứa 1 số thông tin như tổng số product, page_id, has_next, etc
     */
    meta: {
        page_id: number;
        total_count: number;
        has_next: boolean;
    };

    /**
     * List danh mục sub categories (nếu có)
     */
    sub: any;

    /**
     * Hàm loadMore khi user xem hết sp
     */
    loadMore: any;

    /**
     * Object filterOptions, gồm 3 trường Type, Color, Size
     */
    filter: any;

    priceRange: any;

    /**
     * Filter hiện tại ở màn hình chính
     */
    currentFilter: Partial<ProductFilterArgs>;

    /**
     * Thay đổi filter hiện tại sẽ call api
     */
    setFilter: any;

    refetch: any;
}
const ProductList = memo(({ data, meta, sub, loadMore, filter, priceRange, currentFilter, setFilter }: IProps) => {
    const numFilter = useMemo(() => {
        var count = 0;
        if (currentFilter.order) ++count;
        if (currentFilter.type_variant_id) ++count;
        if (currentFilter.color_variant_id) ++count;
        if (currentFilter.size_variant_id) ++count;
        if (currentFilter.minPrice && currentFilter.maxPrice) ++count;

        return count;
    }, [currentFilter]);

    const { onEndReached } = useScrollReachEnd();
    const toFilter = () => {
        navigate('FilterScreen', { filter, priceRange, currentFilter, setFilter });
    };

    const [isHide, setHide] = useState(false);

    if (!data) return null;
    return (
        <ScrollView
            style={{ flex: 1 }}
            onScroll={({ nativeEvent }) => {
                onEndReached(nativeEvent, loadMore);
                if (nativeEvent.contentOffset.y > 40) setHide(true);
                else setHide(false);
            }}
            removeClippedSubviews
            stickyHeaderIndices={[0]}
            scrollEventThrottle={8}
        >
            <View style={[styles.rowFilter, isHide && { borderBottomWidth: 1, borderBottomColor: lightColor.graybg }]}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <TextNormal style={{ fontSize: 15 }}>About {meta.total_count} result</TextNormal>
                    <Pressable style={styles.filterButton} onPress={toFilter} hitSlop={12}>
                        <FilterIcon width={20} height={20} />
                        {!!numFilter && (
                            <View style={styles.numFilter} pointerEvents="none">
                                <TextSemiBold style={{ fontSize: 10, color: 'white', marginTop: 1 }}>
                                    {numFilter}
                                </TextSemiBold>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            <ListData data={data} />
            {meta?.has_next && data.length > 0 && <LoadingMore />}
        </ScrollView>
    );
});

export const ListData = memo(({ data }: { data: any[] }) => {
    const newData = splitColArray(data);
    //console.log('Result', data);
    if (!newData || data.length == 0) return <EmptyResult />;
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
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    filterButton: {
        width: 36,
        height: 36,
        backgroundColor: lightColor.graybg,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productList: { width: '100%', flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between' },
    numFilter: {
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: lightColor.price,
        position: 'absolute',
        top: -4,
        right: -4,
    },
});
