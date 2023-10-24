import { api, domainApi } from '@api/service';

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        // lấy 5 trending keyword đầu tiên
        fetchDefaultTrending: build.query<any, void>({
            query: () => ({ url: 'search/trending?from=api' }),
            transformResponse: response => {
                return response?.trends?.slice(0, 5);
            },
        }),

        fetchSuggestWord: build.query<any, string>({
            query: keyword => ({ url: 'z-search/suggest/find', params: { keyword, limit: 5 } }),
            transformResponse: response => {
                return response?.trending;
            },
        }),

        fetchPopularProduct: build.query<any, void>({
            query: () => ({ url: 'suggestion-search?from=api' }),
        }),
    }),
});

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchCategoryTree: build.query<any, void>({
            query: () => ({ url: 'category/full-tree' }),
            transformResponse: response => {
                console.log(response);
                return response;
            },
        }),
    }),
});

export const { useFetchDefaultTrendingQuery, useFetchPopularProductQuery, useFetchSuggestWordQuery } = extendedDomain;

export const { useFetchCategoryTreeQuery } = extendedApi;
