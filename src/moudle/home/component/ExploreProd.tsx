import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextSemiBold } from '@components/text';

const ExploreProd = () => {
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 22, marginLeft: 12 }}>Explore by trends</TextSemiBold>
            <View style={{ width: '100%', flexDirection: 'row' }}></View>
        </View>
    );
};

export default memo(ExploreProd);

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: '100%',
    },
});
