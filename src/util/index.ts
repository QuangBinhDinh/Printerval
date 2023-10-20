import { pastel } from '@styles/color';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

export { SCREEN_HEIGHT, SCREEN_WIDTH, splitColArray, randomizeColor };
