import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';

const CARD_WIDTH = (SCREEN_WIDTH - 44) / 2;
const LoadingResult = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SkeletonPlaceholder borderRadius={50}>
                <View style={{ flexDirection: 'row', paddingLeft: 4, marginTop: 16 }}>
                    <View style={{ width: 100, height: 100, marginLeft: 12, borderRadius: 100 }} />
                    <View style={{ width: 100, height: 100, marginLeft: 12, borderRadius: 100 }} />
                    <View style={{ width: 100, height: 100, marginLeft: 12, borderRadius: 100 }} />
                    <View style={{ width: 100, height: 100, marginLeft: 12, borderRadius: 100 }} />
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={12}>
                <View style={{ width: 200, height: 28, marginLeft: 16, marginTop: 48, marginBottom: 14 }} />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={6}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                    }}
                >
                    <View style={{ marginLeft: 16 }}>
                        <View style={{ width: CARD_WIDTH, height: 180 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.9, marginTop: 16, borderRadius: 24 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.75, marginTop: 8, borderRadius: 24 }} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <View style={{ width: CARD_WIDTH, height: 180 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.9, marginTop: 16, borderRadius: 24 }} />
                        <View style={{ height: 22, width: CARD_WIDTH * 0.75, marginTop: 8, borderRadius: 24 }} />
                    </View>
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={6}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
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

export default memo(LoadingResult);
