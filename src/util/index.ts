import { pastel } from '@styles/color';
import { cloneDeep, isNumber } from 'lodash';
import { Dimensions } from 'react-native';
import moment from 'moment';
import Store from '@store/store';
import { Stringifiable } from 'query-string';
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

const splitRowArray = (data?: any[]) => {
    //hàm này không đúng với trường hợp lẻ item
    let arrToPush: any[] = [];
    if (!data) return [];
    else
        return data.reduce((prev, next) => {
            arrToPush.push(next);
            if (arrToPush.length == 2) {
                prev.push(cloneDeep(arrToPush));
                arrToPush = [];
            }
            return prev;
        }, []);
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
    //console.log(mins);
    var duration = moment.duration(mins, 'minutes');
    if (mins < 60 && mins >= 1) format = mins + ' min ago';
    else if (mins >= 60 && mins < 60 * 24) format = Math.floor(duration.asHours()) + ' hours ago';
    else if (mins >= 60 * 24 && mins < 60 * 24 * 31) format = Math.floor(duration.asDays()) + ' days ago';
    else if (mins >= 60 * 24 * 31 && mins < 60 * 24 * 31 * 12) format = Math.floor(duration.asMonths()) + ' months ago';
    else if (mins > 60 * 24 * 31 * 12) format = Math.floor(duration.asYears()) + ' years ago';
    return format;
};

/**
 * Lấy query status của 1 query bất kì
 * @note Có thể ảnh hưởng tới performance nếu sử dụng nhiều
 */
const getQueryStatusByName = (queryName: string) => {
    const mutationState = Store.getState().api.mutations;
    return Object.values(mutationState).find(query => query?.endpointName == queryName)?.status;
};

/**
 * Xoá toàn bộ HTML tag khỏi string
 * @param description
 * @returns
 */
const stripHTMLTags = (description: string | null | undefined) => {
    if (!description) return '';

    var noTable = description.slice(description.indexOf('</table>') + 9);
    let noPTags = noTable.replace(/<\/?[^>]+(>|$)/g, '');

    // Remove <a>, <table> tags and their contents
    let noTags = noPTags.replace(/<a(.*?)<\/a>/g, '');

    // Replace <br/> with \n
    let finalString = noTags.replace(/<br\s*\/?>/g, '');

    return finalString;
};

export {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    DESIGN_RATIO,
    splitColArray,
    splitRowArray,
    randomizeColor,
    formatPrice,
    timeBefore,
    normalizeDateTime,
    stripHTMLTags,
};
