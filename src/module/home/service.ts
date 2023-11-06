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

        //api bị lỗi , cần fix lại
        browsingHistory: build.mutation<any, { product_id: number; token: string }>({
            query: body => ({
                url: 'browsing-history/asyn-get-history?ignore_localization=1',
                method: 'post',
                body: { url: 'https://printerval.com/', ...body },
            }),
        }),
    }),
});

export const { useFetchHomeBannerQuery, useFetchPopularDesignQuery, useFetchCategoryBannerQuery } = extendedApi;

export const { useFetchExploreProdQuery, useBrowsingHistoryMutation } = extendedDomain;
