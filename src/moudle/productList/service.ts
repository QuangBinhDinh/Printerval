import { api } from '@api/service';
import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';
import qs from 'query-string';
import { isEqual } from 'lodash';

export interface ProductFilterArgs {
    id: string;
    category_id: string | number;
    category_slug: string;
    q: string;
    page_size: number;
    page_id: number;
    minPrice: string | number;
    maxPrice: string | number;
    order: string;
    dt: number;
}

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchProductResult: build.query<any, Partial<ProductFilterArgs>>({
            query: args => {
                var newArgs = Object.assign({ page_size: 40, page_type: 'category' }, args);
                return { url: 'mobile/product/category-filter', method: 'get', params: newArgs };
            },
            serializeQueryArgs: ({ queryArgs, endpointName, endpointDefinition }) => {
                const { id, q, minPrice, maxPrice, order, dt } = queryArgs;
                return `fetchProductResult?${qs.stringify({ id, q, minPrice, maxPrice, order, dt })}`;
            },
            merge: (curCache, newData, { arg }) => {
                // chỉ merge data trả về khi load more (page_id >=1)
                console.log('merging', newData.result);
                if (newData.result?.length > 0) {
                    var merged = curCache.result.concat(newData.result);
                    curCache.result = merged;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return !isEqual(currentArg, previousArg);
            },
        }),
    }),
});

export const { useFetchProductResultQuery } = extendedApi;

/**
 * Kiểm tra xem 2 bộ lọc sp được xem là giống nhau (không quan tâm page_id)
 */
export const distinctFilter = (filter1: Partial<ProductFilterArgs>, filter2: Partial<ProductFilterArgs>) => {
    const { category_id, page_size, page_id, ...uniq1 } = filter1;
    const { category_id: c, page_size: p, page_id: pid, ...uniq2 } = filter2;
    return isEqual(uniq1, uniq2);
};
