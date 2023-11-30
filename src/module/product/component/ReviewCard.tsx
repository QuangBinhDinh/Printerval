import StarRating from '@components/StarRating';
import { TextNormal } from '@components/text';
import { ProductReview } from '@type/common';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RANDOM_IMAGE_URL } from '@constant/index';
import { timeBefore } from '@util/index';

const ReviewCard = ({ item }: { item: ProductReview }) => {
    return (
        <View style={styles.reviewItem} key={item.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                    <FastImage style={styles.reviewAvatar} source={{ uri: RANDOM_IMAGE_URL }} />
                    <View style={{ height: 40, marginLeft: 10, justifyContent: 'space-around' }}>
                        <TextNormal>{item.full_name.trim()}</TextNormal>
                        <StarRating width={84} rating={item.rating} />
                    </View>
                </View>

                <TextNormal style={{ fontSize: 13, color: '#999' }}>{timeBefore(item.created_at)}</TextNormal>
            </View>

            <TextNormal style={{ marginTop: 16, lineHeight: 20 }} numberOfLines={3}>
                {item.content.trim()}
            </TextNormal>
        </View>
    );
};

export default memo(ReviewCard);

const styles = StyleSheet.create({
    reviewItem: {
        width: '100%',
        marginTop: 32,
    },
    reviewAvatar: { width: 40, height: 40, borderRadius: 40, overflow: 'hidden' },
});
