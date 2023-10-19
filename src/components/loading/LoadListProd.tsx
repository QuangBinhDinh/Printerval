import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';

const LoadListProd = () => (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'white', paddingHorizontal: 12, width: SCREEN_WIDTH }]}>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={{ marginTop: 30, marginBottom: 20 }}>
                <View style={{ height: 30, width: 200 }}></View>
                <View style={{ marginTop: 14, height: 20, width: 100 }}></View>
            </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={styles.rowItem}>
                <View style={styles.item}></View>
                <View style={styles.item}></View>
            </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={styles.rowItem}>
                <View style={styles.item}></View>
                <View style={styles.item}></View>
            </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={styles.rowItem}>
                <View style={styles.item}></View>
                <View style={styles.item}></View>
            </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={styles.rowItem}>
                <View style={styles.item}></View>
                <View style={styles.item}></View>
            </View>
        </SkeletonPlaceholder>
    </View>
);

export default memo(LoadListProd);

const styles = StyleSheet.create({
    item: {
        width: '47%',
        aspectRatio: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        width: '100%',
    },
});
