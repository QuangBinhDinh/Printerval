import { api } from '@api/service';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchHomeBanner: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=slide', method: 'get' }),
        }),

        fetchPopularDesign: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=design-box-popular-tags-data', method: 'get' }),
        }),
        fetchCategoryBanner: build.query<any, void>({
            query: () => ({ url: 'category/home-banner?limit=6' }),
        }),
    }),
});

export const { useFetchHomeBannerQuery, useFetchPopularDesignQuery, useFetchCategoryBannerQuery } = extendedApi;
