import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface IProps {
    style?: StyleProp<ViewStyle>;
    rating?: number;
    width?: number;
    starSize?: number;
}

const StarRating = ({ rating, width = 90, style, starSize = 14 }: IProps) => {
    if (!rating) return null;
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', width, justifyContent: 'space-between' }, style]}>
            {[1, 2, 3, 4, 5].map(item => {
                var name = 'star';

                if (item > rating && item - rating >= 0.75) {
                    name = 'star-o';
                } else if (item > rating && item - rating >= 0.25 && item - rating < 0.75) {
                    name = 'star-half-empty';
                }

                return (
                    <Icon type="font-awesome" name={name} size={starSize} color={lightColor.yellowstar} key={item} />
                );
            })}
        </View>
    );
};

export default memo(StarRating);
