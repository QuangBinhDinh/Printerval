import React, { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH } from '@util/index';

const LoadMoreProd = () => (
    <View style={{ width: '100%', marginTop: 12, borderWidth: 0 }}>
        <SkeletonPlaceholder borderRadius={6}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.item}></View>
                <View style={styles.item}></View>
            </View>
        </SkeletonPlaceholder>
    </View>
);

export default memo(LoadMoreProd);

const styles = StyleSheet.create({
    item: {
        width: '47%',
        aspectRatio: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});
