import HeaderScreen from '@components/HeaderScreen';
import { SearchResultRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ProductFilterArgs, useFetchProductSearchQuery } from './service';
import LoadingResult from './component/LoadingResult';
import ProductList from './component/ProductListAnimated';

const SearchResult = () => {
    const {
        params: { keyword, title },
    } = useRoute<SearchResultRouteProp>();

    const [searchFilter, setFilter] = useState<Partial<ProductFilterArgs>>({
        q: keyword,
        dt: Date.now(),
    });
    //nest destructing with possible undefined value
    const { data: { products, filterOptions, priceRange, categories, meta } = {}, isFetching } =
        useFetchProductSearchQuery(searchFilter);

    const loadMore = useCallback(() => {
        if (meta?.has_next) {
            setFilter(prev => ({ ...prev, page_id: meta?.page_id ? Number(meta.page_id) + 1 : 1 }));
        }
    }, [meta]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={title} />
            <View style={{ flex: 1 }}>
                {isFetching && !searchFilter.page_id ? (
                    <LoadingResult />
                ) : (
                    <ProductList
                        data={products}
                        meta={meta}
                        sub={categories}
                        loadMore={loadMore}
                        filter={filterOptions}
                        priceRange={priceRange}
                        currentFilter={searchFilter}
                        setFilter={setFilter}
                    />
                )}
            </View>
        </View>
    );
};

export default SearchResult;
