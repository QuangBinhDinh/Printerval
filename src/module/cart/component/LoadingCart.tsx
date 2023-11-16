import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoadingCart = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SkeletonPlaceholder borderRadius={6}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 32,
                        paddingHorizontal: 16,
                    }}
                >
                    <View style={{ width: 125, height: 125 }}></View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ width: 200, height: 22 }}></View>
                        <View style={{ width: 140, height: 22, marginTop: 4 }}></View>
                        <View style={{ width: 200, height: 30, marginTop: 8 }}></View>
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

export default memo(LoadingCart);
