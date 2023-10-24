import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';

const LoadingCategory = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 24 }}>
            <SkeletonPlaceholder borderRadius={50}>
                <View style={{ alignSelf: 'center', width: '92%', height: 52, marginBottom: 24 }}></View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={12}>
                <View style={{ marginLeft: 16 }}>
                    <View style={{ width: 140, height: 24, marginBottom: 16 }} />
                    <View style={{ width: 180, height: 24, marginBottom: 16 }} />
                    <View style={{ width: 220, height: 24, marginBottom: 16 }} />
                    <View style={{ width: 180, height: 24, marginBottom: 16 }} />
                </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={6}>
                <View style={{ flexDirection: 'row', marginLeft: 16, marginTop: 24 }}>
                    <View style={{ width: 200, height: 120, marginRight: 12 }}></View>
                    <View style={{ width: 200, height: 120, marginRight: 12 }}></View>
                </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={12}>
                <View style={{ marginLeft: 16, marginTop: 32 }}>
                    <View style={{ width: 260, height: 24, marginBottom: 16 }} />
                    <View style={{ width: 200, height: 24, marginBottom: 16 }} />
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

export default memo(LoadingCategory);
