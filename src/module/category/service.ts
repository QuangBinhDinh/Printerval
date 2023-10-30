import { api, domainApi } from '@api/service';
import { cloneDeep } from 'lodash';

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        // lấy 5 trending keyword đầu tiên
        fetchDefaultTrending: build.query<any, void>({
            query: () => ({ url: 'search/trending?from=api' }),
            transformResponse: response => {
                return response?.trends?.slice(0, 5);
            },
        }),

        fetchSuggestWord: build.query<{ suggestTrend: any[]; suggest: any[] }, string>({
            query: keyword => ({ url: 'z-search/suggest/find', params: { keyword, limit: 5, dt: Date.now() } }),
            transformResponse: response => {
                return { suggestTrend: response?.trending, suggest: response?.suggest };
            },
            //providesTags: ['DefaultTrending'],
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
                // console.log('Tree', response);
                var arr: any[] = response?.result;
                if (!!arr) {
                    let newArr = arr.slice(1).filter(item => item.children !== undefined);
                    recursive(newArr); // transform response category tree
                    return newArr;
                }
                return null;
            },
        }),
    }),
});
const recursive = (data: any[], level = 0) => {
    //với những item có level = 1 (section) , nếu không có children sẽ dùng chính nó làm child
    data.forEach((item, index, ls) => {
        if (level == 1 && !!item.children) {
            //console.log(item.children.map(i => i.image_url));
        }
        if (item.children) recursive(item.children, level + 1);
        else if (!item.children && level == 1) {
            let temp = cloneDeep(item);
            temp.children = null;
            ls[index].children = [
                {
                    ...temp,
                },
            ];
        }
    });
};

export const {
    useFetchDefaultTrendingQuery,
    useFetchPopularProductQuery,
    useFetchSuggestWordQuery,
    useLazyFetchSuggestWordQuery,
} = extendedDomain;
export const { useFetchCategoryTreeQuery } = extendedApi;
