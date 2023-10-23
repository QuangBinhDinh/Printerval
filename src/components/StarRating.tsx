import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface IProps {
    style?: StyleProp<ViewStyle>;
    rating: number;
    width?: number;
    starSize?: number;
}

const StarRating = ({ rating, width = 90, style }: IProps) => {
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', width, justifyContent: 'space-between' }, style]}>
            {[1, 2, 3, 4, 5].map(item => {
                return <Icon type="font-awesome" name="star" size={14} color={lightColor.yellowstar} key={item} />;
            })}
        </View>
    );
};

export default memo(StarRating);
