import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoadingProduct = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SkeletonPlaceholder borderRadius={6}>
                <View
                    style={{
                        marginLeft: 18,
                        width: SCREEN_WIDTH - 36,
                        aspectRatio: 1.1,
                        marginTop: 40 + insets.top / 1.5,
                    }}
                />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 30,
                        justifyContent: 'space-between',
                        paddingHorizontal: 18,
                    }}
                >
                    <View style={{ width: 80, height: 22 }}></View>
                    <View style={{ width: 100, height: 22 }}></View>
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: SCREEN_WIDTH - 36,
                        height: 28,
                        marginTop: 20,
                    }}
                />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: SCREEN_WIDTH - 36,
                        height: 28,
                        marginTop: 8,
                    }}
                />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: 100,
                        height: 28,
                        marginTop: 8,
                    }}
                />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 30,

                        paddingHorizontal: 18,
                    }}
                >
                    <View style={{ width: 90, height: 34 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

export default memo(LoadingProduct);
