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
export const SCREEN_WITH_COLOR = ['LoginScreen', 'CreateAccount'];

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

/**
 * Số từ khoá đã tìm kiếm tối đa
 */
export const MAX_SEARCH_HISTORY = 3;

/**
 * Số sp vừa xem tối đa
 */
export const MAX_PROD_HISTORY = 10;

/**
 * Key lưu trữ data của AsyncStorage
 */
export const STORAGE_KEY = {
    AUTH_DATA: 'AuthData',
    AUTH_SOCIAL_DATA: 'AuthSocialData',

    /**
     * Token dùng để add to cart, product history , etc
     */
    CUSTOMER_TOKEN: 'CustomerToken',
};

export const ORDER_SIZE = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
