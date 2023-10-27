import React, { memo, useState, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProductFilterArgs } from '@searchResult/service';
import { splitColArray } from '@util/index';
import DynamicCard from '@components/product/DynamicCard';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { FilterIcon } from '@assets/svg';
import SubCategory from './SubCategory';
import { useScrollReachEnd } from '@components/hooks/useScrollReachEnd';
import LoadingMore from './LoadingMore';
import { navigate } from '@navigation/service';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import EmptyResult from './EmptyResult';
import { ListData } from './ProductList';

const TRANS_THRESHOLD = 186;

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
const ProductListAnimated = memo(
    ({ data, meta, sub, loadMore, filter, priceRange, currentFilter, setFilter }: IProps) => {
        const numFilter = useMemo(() => {
            var count = 0;
            if (currentFilter.order) ++count;
            if (currentFilter.type_variant_id) ++count;
            if (currentFilter.color_variant_id) ++count;
            if (currentFilter.size_variant_id) ++count;
            if (currentFilter.from && currentFilter.to) ++count;

            return count;
        }, [currentFilter]);

        const scrollY = useSharedValue(0);
        const animStyle = useAnimatedStyle(() => ({
            transform: [
                {
                    translateY: interpolate(scrollY.value, [0, TRANS_THRESHOLD], [0, -TRANS_THRESHOLD], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                    }),
                },
            ],
        }));
        const [isHide, setHide] = useState(false);

        const { onEndReached } = useScrollReachEnd();
        const toFilter = () => {
            navigate('FilterScreen', { filter, priceRange, currentFilter, setFilter });
        };

        if (!data) return null;
        return (
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        styles.stickyHeader,
                        animStyle,
                        isHide && {
                            borderBottomWidth: 1,
                            borderBottomColor: lightColor.graybg,
                        },
                    ]}
                >
                    <SubCategory data={sub} />
                    <View style={styles.rowFilter}>
                        <TextNormal style={{ fontSize: 15 }}>About {meta.total_count} results</TextNormal>
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
                </Animated.View>

                <Animated.ScrollView
                    style={{ flex: 1 }}
                    onScroll={({ nativeEvent }) => {
                        onEndReached(nativeEvent, loadMore);
                        var y = nativeEvent.contentOffset.y;
                        scrollY.value = y;
                        // khi vượt quá threshold này, coi như bottom tab được hide
                        if (y > TRANS_THRESHOLD) setHide(true);
                        else setHide(false);
                    }}
                    removeClippedSubviews
                >
                    <View style={{ height: 220 }} />
                    <ListData data={data} />
                    {meta?.has_next && data.length > 0 && <LoadingMore />}
                </Animated.ScrollView>
            </View>
        );
    },
);

export default memo(ProductListAnimated);
const styles = StyleSheet.create({
    stickyHeader: {
        backgroundColor: 'white',
        paddingTop: 16,
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 100,
    },
    rowFilter: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderWidth: 1,
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
