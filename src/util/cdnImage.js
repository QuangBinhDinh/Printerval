const IMAGE_URL = 'https://cdn.prtvstatic.com/';
const EXCLUDE_CDN_DOMAIN = [
    'localhost',
    '.test',
    '.vn',
    '.local',
    'liveview.printerval.com',
    'redbubble.net',
    'amazon.com',
    'printerval.com/unsafe',
    'i.etsystatic.com',
    'res.cloudinary.com',
    'printerval.megaads.vn',
    'image.spreadshirtmedia.com',
    'd1q9av5b648rmv.cloudfront.net',
    'cdn.shopify.com',
    '.jfif',
    '.avif',
    '.jfif',
    '.pjpeg',
    '.pjp',
    '.tif',
    '.tiff',
    '.ico',
    '.cur',
    '.bmp',
    '.gif',
];

/**
 * Hàm chuyển đổi url ảnh để scale
 * @param {string} image_url url ảnh trả về
 * @param {number} width
 * @param {number} height
 * @param {fitIn} boolean
 * @returns
 */
export const cdnImage = (image_url, width = 600, height = 600, fitIn = false) => {
    if (!image_url) return '';
    let suffix = image_url;

    suffix = suffix.replace('assets.printerval.com', 'asset.prtvstatic.com');
    suffix = suffix.replace('cdn.printerval.com', 'cdn.prtvstatic.com');
    suffix = suffix.replace('liveview.printerval.com', 'liveview.prtvstatic.com');
    suffix = suffix.replace('sticker-liveview.printerval.com', 'sticker.prtvstatic.com');

    if (EXCLUDE_CDN_DOMAIN.some(str => image_url.includes(str))) return suffix;

    suffix = suffix.replace('https://', '');
    suffix = suffix.replace('http://', '');
    if (suffix.includes('?')) suffix = encodeURIComponent(suffix);

    const fit = fitIn ? '/fit-in' : '';
    return `${IMAGE_URL}unsafe${fit}/${width}x${height}/${suffix}`;
};
