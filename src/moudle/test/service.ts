import { api } from '@api/service';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchHomeBanner2: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=slide', method: 'get' }),
        }),

        fetchPopularDesign2: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=design-box-popular-tags-data', method: 'get' }),
        }),
        fetchCategoryBanner2: build.query<any, void>({
            query: () => ({ url: 'category/home-banner?limit=6' }),
        }),
    }),
});

export const { useFetchHomeBanner2Query, useFetchPopularDesign2Query, useFetchCategoryBanner2Query } = extendedApi;
