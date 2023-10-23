import FancyButton from '@components/FancyButton';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const ReferFriend = () => {
    const toRefer = () => {};
    return (
        <View style={styles.container}>
            <FastImage style={styles.image} source={require('@image/Refer.png')} />
            <TextSemiBold style={{ fontSize: 22, marginTop: 14 }}>Refer a Friend</TextSemiBold>
            <TextNormal style={styles.subTitle}>Get $7.50 to spend each time you refer a friend</TextNormal>
            <FancyButton style={styles.button} backgroundColor={lightColor.primary} onPress={toRefer}>
                <TextSemiBold style={{ fontSize: 17, color: 'white' }}>Refer Friend Now</TextSemiBold>
            </FancyButton>
        </View>
    );
};

export default memo(ReferFriend);

const styles = StyleSheet.create({
    container: { marginTop: 32, paddingHorizontal: 12, width: '100%', alignItems: 'center' },
    image: {
        width: '100%',
        aspectRatio: 340 / 133,
    },
    subTitle: {
        fontSize: 17,
        marginTop: 8,
        width: '100%',
        textAlign: 'center',
    },
    button: {
        width: '98%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: lightColor.primary,
    },
});
