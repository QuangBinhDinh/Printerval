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

export const RELEVANT = [
    {
        name: 'Best Selling',
        param: 'sold',
    },
    {
        name: 'Newest',
        param: 'lastest',
    },
    {
        name: 'Top View',
        param: 'view',
    },
    {
        name: 'Price: Low to High',
        param: 'low_price',
    },
    {
        name: 'Price: High to Low',
        param: 'high_price',
    },
    {
        name: 'Top Discount',
        param: 'sale',
    },
];
