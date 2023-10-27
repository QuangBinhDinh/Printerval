import HeaderScreen from '@components/HeaderScreen';
import { SearchResultRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ProductFilterArgs, useFetchProductResultQuery } from './service';
import LoadingResult from './component/LoadingResult';
import ProductList from './component/ProductList';
import ProductListAnimated from './component/ProductListAnimated';

const ProductCategory = () => {
    const {
        params: { keyword, categoryId, title },
    } = useRoute<SearchResultRouteProp>();

    const [searchFilter, setFilter] = useState<Partial<ProductFilterArgs>>({
        id: categoryId,
        category_id: categoryId,
        q: keyword,
        dt: Date.now(),
    });
    //nest destructing with possible undefined value
    const {
        data: { result, filterOptions, priceRange, categories, meta } = {},
        isFetching,
        refetch,
    } = useFetchProductResultQuery(searchFilter);

    const loadMore = useCallback(() => {
        if (meta?.has_next) {
            setFilter(prev => ({ ...prev, page_id: meta?.page_id ? Number(meta.page_id) + 1 : 1 }));
        }
    }, [meta]);

    //nếu có sub category, hiển thị animated header khi scroll.
    const subCategories = categories?.filter((item: any) => item.id != categoryId);

    const ListData = subCategories && subCategories.length > 0 ? ProductListAnimated : ProductList;
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={title} />
            <View style={{ flex: 1 }}>
                {isFetching && !searchFilter.page_id ? (
                    <LoadingResult />
                ) : (
                    <ListData
                        data={result}
                        meta={meta}
                        sub={subCategories}
                        loadMore={loadMore}
                        filter={filterOptions}
                        priceRange={priceRange}
                        currentFilter={searchFilter}
                        setFilter={setFilter}
                        refetch={refetch}
                    />
                )}
            </View>
        </View>
    );
};

export default ProductCategory;
