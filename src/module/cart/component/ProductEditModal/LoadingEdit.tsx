import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';

const LoadingEdit = () => {
    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'white', zIndex: 500 }]}>
            <SkeletonPlaceholder borderRadius={6}>
                <View style={{ flexDirection: 'row', marginLeft: 18, marginTop: 24 }}>
                    <View style={{ width: 125, height: 125 }}></View>

                    <View style={{ flex: 1, paddingLeft: 14 }}>
                        <View style={{ width: 200, height: 16 }}></View>
                        <View style={{ width: 140, height: 16, marginTop: 6 }}></View>
                        <View style={{ width: 80, height: 16, marginTop: 14 }}></View>
                    </View>
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: 100,
                        height: 22,
                        marginTop: 32,
                    }}
                />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                    }}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                        <View style={{ height: 42, width: 42, marginLeft: 12 }} key={item} />
                    ))}
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: 100,
                        height: 22,
                        marginTop: 32,
                    }}
                />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                        paddingHorizontal: 18,
                    }}
                >
                    <View style={{ width: 90, height: 34 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: 100,
                        height: 22,
                        marginTop: 32,
                    }}
                />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                        paddingHorizontal: 18,
                    }}
                >
                    <View style={{ width: 90, height: 34 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                </View>
            </SkeletonPlaceholder>

            {/* <SkeletonPlaceholder borderRadius={50}>
                <View
                    style={{
                        marginLeft: 18,
                        width: 100,
                        height: 22,
                        marginTop: 32,
                    }}
                />
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={30}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                        paddingHorizontal: 18,
                    }}
                >
                    <View style={{ width: 90, height: 34 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                    <View style={{ width: 90, height: 34, marginLeft: 18 }}></View>
                </View>
            </SkeletonPlaceholder> */}
        </View>
    );
};

export default memo(LoadingEdit);
