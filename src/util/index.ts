import { pastel } from '@styles/color';
import { isNumber } from 'lodash';
import { Dimensions } from 'react-native';
import moment from 'moment';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Scale theo  design trên figma
 */
const DESIGN_RATIO = SCREEN_HEIGHT / 810;
/**
 * Tách 1 array thành 2 array có index chẵn lẻ
 */
const splitColArray = (arr: any[]) => {
    if (!arr) return null;
    var firstCol = arr.filter((_, index) => index % 2 == 0);
    var secondCol = arr.filter((_, index) => index % 2 == 1);
    return [firstCol, secondCol];
};
/**
 * Trả về 1 mảng color ngẫu nhiên từ pastel color
 * @param numCol số lượng color cần lấy
 */
const randomizeColor = (numCol = 4) => {
    const arr = pastel.slice();
    let curIndex = arr.length - 1,
        randIndex;

    while (curIndex > 0) {
        randIndex = Math.floor(Math.random() * (curIndex + 1));

        //swap array element
        [arr[curIndex], arr[randIndex]] = [arr[randIndex], arr[curIndex]];
        curIndex--;
    }

    return arr.slice(0, numCol);
};

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const formatPrice = (priceNum: string | number) => {
    let localePrefix = '$';
    if (isNumber(priceNum)) return formatter.format(priceNum);
    else return localePrefix + priceNum;
};

/**
 * Convert date time của Printerval về dạng chuẩn
 * @param time
 */
const normalizeDateTime = (time: string) => {
    const arrTime = time.split(' ');
    const dateArr = arrTime[0].split('-');

    return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]} ${arrTime[1]}`;
};

const timeBefore = (created_time: string) => {
    let format = 'Vừa xong';
    var mins = moment(new Date()).diff(created_time, 'minutes');
    console.log(mins);
    var duration = moment.duration(mins, 'minutes');
    if (mins < 60 && mins >= 1) format = mins + ' min ago';
    else if (mins >= 60 && mins < 60 * 24) format = Math.floor(duration.asHours()) + ' hours ago';
    else if (mins >= 60 * 24 && mins < 60 * 24 * 31) format = Math.floor(duration.asDays()) + ' days ago';
    else if (mins >= 60 * 24 * 31 && mins < 60 * 24 * 31 * 12) format = Math.floor(duration.asMonths()) + ' months ago';
    else if (mins > 60 * 24 * 31 * 12) format = Math.floor(duration.asYears()) + ' years ago';
    return format;
};
export {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    DESIGN_RATIO,
    splitColArray,
    randomizeColor,
    formatPrice,
    timeBefore,
    normalizeDateTime,
};
