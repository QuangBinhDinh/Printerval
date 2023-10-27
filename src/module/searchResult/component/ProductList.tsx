import React, { memo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProductFilterArgs } from '@searchResult/service';
import { SCREEN_WIDTH, splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { FilterIcon } from '@assets/svg';
import SubCategory from './SubCategory';
import { useScrollReachEnd } from '@components/hooks/useScrollReachEnd';
import LoadingMore from './LoadingMore';
import { navigate } from '@navigation/service';

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
}
const ProductList = memo(({ data, meta, sub, loadMore, filter, priceRange, currentFilter, setFilter }: IProps) => {
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
                    <TextNormal style={{ fontSize: 15 }}>About {meta.total_count} results</TextNormal>
                    <Pressable style={styles.filterButton} onPress={toFilter} hitSlop={12}>
                        <FilterIcon width={20} height={20} />
                    </Pressable>
                </View>
            </View>

            <ListData data={data} />
            {meta?.has_next && <LoadingMore />}
        </ScrollView>
    );
});

const ListData = memo(({ data }: { data: any[] }) => {
    const newData = splitColArray(data);
    console.log('Result', data);
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
});
