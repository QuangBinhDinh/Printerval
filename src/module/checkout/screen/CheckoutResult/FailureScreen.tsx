import { CheckoutFailure, CheckoutSuccess } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO, SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { shadowTop } from '@styles/shadow';
import { goBack, navigate } from '@navigation/service';
import { usePreventGoBack } from '@navigation/customHook';
import { normalize } from '@rneui/themed';

const CheckoutFailureScreen = () => {
    const insets = useSafeAreaInsets();

    const tryAgain = () => {
        goBack();
    };

    //usePreventGoBack();
    return (
        <View style={styles.container}>
            <CheckoutFailure width={normalize(140)} height={normalize(160)} />

            <TextSemiBold style={styles.title}>Payment Error</TextSemiBold>
            <TextNormal style={{ marginTop: normalize(24), width: '80%' }}>
                Your transaction has failed due to some technical error. Please try again.
            </TextNormal>

            <View
                style={[
                    styles.bottomView,
                    shadowTop,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={tryAgain}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Try again</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default CheckoutFailureScreen;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: normalize(20), backgroundColor: 'white' },
    title: {
        fontSize: 20,
        lineHeight: 24,
        marginTop: normalize(40),
        color: '#444',
    },
    orderCodeView: {
        height: 56,
        width: 220,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        marginTop: normalize(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
