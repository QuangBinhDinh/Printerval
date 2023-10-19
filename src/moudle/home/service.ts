import { api, domainApi } from '@api/service';

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

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        fetchExploreProd: build.query<any, void>({
            query: () => ({ url: 'product/recommendation' }),
        }),
    }),
});

export const { useFetchHomeBannerQuery, useFetchPopularDesignQuery, useFetchCategoryBannerQuery } = extendedApi;

export const { useFetchExploreProdQuery } = extendedDomain;
