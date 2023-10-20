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

export { SCREEN_HEIGHT, SCREEN_WIDTH, splitColArray };
