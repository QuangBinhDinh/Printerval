import { PixelRatio } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '.';

//Scale base on figma design
const widthBaseScale = SCREEN_WIDTH / 375;

const heightBaseScale = SCREEN_HEIGHT / 812;

const normalize = (size: number, based = 'width') => {
    const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
