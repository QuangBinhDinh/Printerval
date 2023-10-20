import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const IntroView = () => {
    return (
        <View style={{ width: '100%', marginTop: 50 }}>
            <View style={styles.imageContainer}>
                <FastImage style={styles.smallImage} />
                <FastImage style={styles.bigImage} />
                <FastImage style={styles.smallImage} />
            </View>
            <View style={styles.contentView}>
                <ImageBackground
                    style={{ flex: 1, paddingHorizontal: 16 }}
                    source={require('@assets/image/bg-spice.png')}
                    resizeMode="cover"
                >
                    <TextSemiBold style={{ fontSize: 22, marginTop: 180 }}>
                        <TextSemiBold style={{ color: lightColor.secondary }}>Printerval</TextSemiBold> Spice up your
                        life
                    </TextSemiBold>
                    <TextNormal style={{ fontSize: 17, marginTop: 20 }}>
                        Printerval.com is an online marketplace, where people come together to make, sell, buy, and
                        collect unique items. There’s no Printerval warehouse – just independent sellers selling the
                        things they love.{'\n'}
                        {'\n'}We make the whole process easy, helping you connect directly with makers to find something
                        extraordinary.
                    </TextNormal>
                </ImageBackground>
            </View>
        </View>
    );
};

export default memo(IntroView);

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 220,
        zIndex: 100,
    },
    smallImage: {
        width: 130,
        height: 130,
        borderRadius: 130,
        borderWidth: 1.5,
        borderColor: lightColor.primary,
    },
    bigImage: {
        width: 130,
        height: 130,
        borderRadius: 130,
        borderWidth: 1.5,
        borderColor: lightColor.secondary,
        zIndex: 200,
        transform: [{ scale: 22 / 13 }],
        // position: 'absolute',
        // alignSelf: 'center',
    },
    contentView: { width: SCREEN_WIDTH, aspectRatio: 0.878, marginTop: -120 },
});
