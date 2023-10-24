import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const SpiceUpView = () => {
    console.log(SCREEN_WIDTH);
    return (
        <View style={{ width: SCREEN_WIDTH, marginTop: 32 }}>
            <View style={styles.contentView}>
                <ImageBackground
                    style={{ flex: 1, paddingHorizontal: 12 }}
                    source={require('@assets/image/bg-spice.png')}
                    resizeMode="cover"
                >
                    <TextSemiBold style={{ fontSize: 22, marginTop: 150 }}>
                        <TextSemiBold style={{ color: lightColor.secondary }}>Printerval</TextSemiBold> Spice up your
                        life
                    </TextSemiBold>
                    <TextNormal style={{ fontSize: 17, marginTop: 14 }}>
                        <TextNormal style={{ color: lightColor.secondary }}>Printerval.com</TextNormal> is an online
                        marketplace, where people come together to make, sell, buy, and collect unique items. There’s no
                        Printerval warehouse – just independent sellers selling the things they love.{'\n'}
                        {'\n'}We make the whole process easy, helping you connect directly with makers to find something
                        extraordinary.
                    </TextNormal>
                </ImageBackground>
            </View>
            <View style={styles.imageContainer}>
                <FastImage style={styles.smallImage} />
                <FastImage style={styles.bigImage} />
                <FastImage style={styles.smallImage} />
            </View>
        </View>
    );
};

export default memo(SpiceUpView);

const styles = StyleSheet.create({
    contentView: { width: SCREEN_WIDTH, height: SCREEN_WIDTH >= 400 ? 460 : 500, marginTop: 100 },
    imageContainer: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 220,
        position: 'absolute',
        top: 0,
    },
    smallImage: {
        width: (SCREEN_WIDTH - 5) / 3,
        aspectRatio: 1,
        borderRadius: 130,
        borderWidth: 1.5,
        borderColor: lightColor.primary,
    },
    bigImage: {
        width: (SCREEN_WIDTH - 5) / 3,
        aspectRatio: 1,
        borderRadius: 130,
        borderWidth: 1.5,
        borderColor: lightColor.secondary,
        zIndex: 200,
        transform: [{ scale: 22 / 13 }],
    },
});