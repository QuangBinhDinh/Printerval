import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';

const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;
const LoadingMore = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SkeletonPlaceholder borderRadius={6}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                        marginBottom: 18,
                    }}
                >
                    <View style={{ marginLeft: 16 }}>
                        <View style={{ width: CARD_WIDTH, height: 180 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.9, marginTop: 12, borderRadius: 24 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.75, marginTop: 6, borderRadius: 24 }} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <View style={{ width: CARD_WIDTH, height: 180 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.9, marginTop: 12, borderRadius: 24 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.75, marginTop: 6, borderRadius: 24 }} />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

export default memo(LoadingMore);
