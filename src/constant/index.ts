export const RANDOM_IMAGE_URL = 'https://picsum.photos/400';

/**
 * Số ngày hết hạn để fetch lại cây danh mục
 */
export const CATEGORY_EXPIRE_DAY = 7;

/**
 * Thời gian (giây) lưu trữ cache của 1 fetch query
 */
export const CACHE_TIME_SECONDS = 90;

/**
 * List những screen có màu background (để đổi màu status bar thành trắng)
 */
export const SCREEN_WITH_COLOR = [''];

export const RELEVANT = {
    BEST_SELLING: {
        name: 'Best Selling',
        param: 'sold',
    },
    NEWEST: {
        name: 'Newest',
        param: 'lastest',
    },
    TOP_VIEW: {
        name: 'Top View',
        param: 'view',
    },
    PRICE_LOW_TO_HIGH: {
        name: 'Price: Low to High',
        param: 'low_price',
    },
    PRICE_HIGH_TO_LOW: {
        name: 'Price: High to Low',
        param: 'high_price',
    },
    TOP_DISCOUNT: {
        name: 'Top Discount',
        param: 'sale',
    },
};
