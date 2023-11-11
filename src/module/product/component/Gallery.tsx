import SwiperImage from '@components/list/SwiperImage';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ScalableImage from './ScalableImage';

interface IProps {
    gallery: string[];
    isShirt: boolean;
    colIndex: number;

    /**
     * Ảnh color guide nếu có
     */
    selectedColorGuide: string;
}
const Gallery = ({ gallery, isShirt, colIndex, selectedColorGuide }: IProps) => {
    return (
        <View style={styles.container}>
            <SwiperImage images={gallery} />
            {isShirt && !!selectedColorGuide && colIndex >= 0 && <ScalableImage imageUrl={selectedColorGuide} />}
        </View>
    );
};

export default memo(Gallery);

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        aspectRatio: 1,
    },
});
