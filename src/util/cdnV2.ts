const IMAGE_URL = 'https://cdn.printerval.com/';

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

const LIVEVIEW_DOMAIN = [
    'sticker-liveview.printerval.com',
    'sticker.liveview.printerval.com',
    'liveview.printerval.com',
    'liveview.prtvstatic.com',
    'sticker.static-printerval.com',
    'sticker.prtvstatic.com',
];

export const cdnImageV2 = (image_url: string, width = 540, height = 540) => {
    if (!image_url) return '';

    var newUrl = image_url;
    var regex = /\d+x\d+/;

    if (LIVEVIEW_DOMAIN.some(str => image_url.includes(str))) {
        for (const domain of LIVEVIEW_DOMAIN) {
            newUrl = newUrl.replace(domain, 'cdn.printerval.com');
        }

        if (regex.test(newUrl)) {
            newUrl = newUrl.replace(regex, `${width}x${height}`);
        } else {
            newUrl = newUrl.replace(/(image\/)/, `$1${width}x${height}/`);
        }
    } else if (EXCLUDE_CDN_DOMAIN.some(str => image_url.includes(str))) {
        //do nothing
    } else {
        newUrl = newUrl.replace('https://', '');
        newUrl = newUrl.replace('http://', '');

        newUrl = newUrl.replace('asset.static-printerval.com', 'assets.printerval.com');
        newUrl = newUrl.replace('asset.prtvstatic.com', 'assets.printerval.com');
        newUrl = newUrl.replace('storage.googleapis.com/printerval-central', 'assets.printerval.com');

        newUrl = `${IMAGE_URL}unsafe/${width}x${height}/` + newUrl;
    }

    return newUrl;
};
