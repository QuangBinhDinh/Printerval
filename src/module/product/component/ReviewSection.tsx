import StarRating from '@components/StarRating';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { Product, ProductReview, ResponseMeta } from '@type/common';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import FastImage from 'react-native-fast-image';
import { RANDOM_IMAGE_URL } from '@constant/index';
import { normalizeDateTime, timeBefore } from '@util/index';

interface IProps {
    product?: Product;
    dashboard?: { rating: number; count: number; percent: number }[];
    reviews?: ProductReview[];
    meta?: ResponseMeta;
}
const ReviewSection = ({ product, dashboard, reviews, meta }: IProps) => {
    console;
    if (!dashboard) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 20, lineHeight: 24 }}>Reviews</TextSemiBold>
            <View style={styles.ratingRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextSemiBold style={{ fontSize: 24, color: '#444' }}>{product?.rating_value}</TextSemiBold>
                    <TextNormal style={{ fontSize: 12 }}>{'  '}OUT OF 5</TextNormal>
                </View>
                <StarRating width={110} starSize={18} rating={product?.rating_value} />
            </View>

            {dashboard.map(item => (
                <View key={item.rating} style={styles.row}>
                    <TextNormal style={{ fontSize: 12, color: '#999', marginTop: 3, textAlign: 'center', width: 15 }}>
                        {item.rating}
                        {'  '}
                    </TextNormal>

                    <Icon type="font-awesome" name="star" color={lightColor.yellowstar} size={14} />
                    <View style={styles.lineground}>
                        <View style={[styles.progressLine, { width: `${item.percent ?? 0}%` }]} />
                    </View>
                    <TextNormal style={{ fontSize: 13, width: 28, textAlign: 'right' }}>{item.percent}%</TextNormal>
                </View>
            ))}

            {!!reviews && !!meta && <ReviewList reviews={reviews} meta={meta} />}
        </View>
    );
};

export default memo(ReviewSection);

const ReviewList = memo(({ reviews, meta }: { reviews: ProductReview[]; meta: ResponseMeta }) => {
    const seeAll = () => {};

    const writeReview = () => {};
    return (
        <View style={{ marginTop: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Pressable hitSlop={10} onPress={seeAll}>
                    <TextNormal style={{ fontSize: 13, color: lightColor.primary }}>
                        View all {meta.total_count} reviews
                    </TextNormal>
                </Pressable>

                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={10} onPress={writeReview}>
                    <TextNormal style={{ fontSize: 13, color: lightColor.secondary, marginTop: 1 }}>
                        WRITE A REVIEW{' '}
                    </TextNormal>
                    <Icon type="material-community" size={14} color={lightColor.secondary} name="lead-pencil" />
                </Pressable>
            </View>

            {reviews.map(item => (
                <View style={styles.reviewItem} key={item.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <FastImage style={styles.reviewAvatar} source={{ uri: RANDOM_IMAGE_URL }} />
                            <View style={{ height: 40, marginLeft: 10, justifyContent: 'space-around' }}>
                                <TextNormal>{item.full_name}</TextNormal>
                                <StarRating width={84} rating={item.rating} />
                            </View>
                        </View>

                        <TextNormal style={{ fontSize: 13, color: '#999' }}>{timeBefore(item.created_at)}</TextNormal>
                    </View>

                    <TextNormal style={{ marginTop: 16, lineHeight: 20 }} numberOfLines={3}>
                        {item.content}
                    </TextNormal>
                </View>
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    container: { width: '100%', marginTop: 32, paddingHorizontal: 18 },
    ratingRow: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    row: {
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lineground: {
        flex: 1,
        marginHorizontal: 10,
        height: 5,
        backgroundColor: '#EFF0F1',
        borderRadius: 6,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    progressLine: {
        height: 5,
        backgroundColor: lightColor.yellowstar,
        borderRadius: 6,
    },

    reviewItem: {
        width: '100%',
        marginTop: 32,
    },
    reviewAvatar: { width: 40, height: 40, borderRadius: 40, overflow: 'hidden' },
});
