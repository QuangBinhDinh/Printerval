import { TextSemiBold } from '@components/text';
import React, { memo } from 'react';
import { Platform, Text } from 'react-native';
import { StyleSheet, View } from 'react-native';

const TrendExplore = () => {
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 12 }}>Explore by trends</TextSemiBold>
            <View style={styles.list}></View>
        </View>
    );
};

export default memo(TrendExplore);

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        width: '100%',
    },
    list: {
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',
        height: 84,
        borderWidth: 1,
        paddingLeft: 12,
    },
});
