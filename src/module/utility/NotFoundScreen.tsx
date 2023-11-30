import { NotFoundIcon } from '@assets/svg';
import FancyButton from '@components/FancyButton';
import { TextNormal, TextSemiBold } from '@components/text';
import { goBack } from '@navigation/service';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { DESIGN_RATIO, SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotFoundScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <NotFoundIcon
                width={306 * DESIGN_RATIO}
                height={306 * DESIGN_RATIO}
                style={{ marginTop: 60 * DESIGN_RATIO }}
            />
            <TextSemiBold style={{ fontSize: 20, lineHeight: 24, color: '#444' }}>Oops!</TextSemiBold>
            <TextNormal style={{ lineHeight: 20, textAlign: 'center', marginTop: 32 * DESIGN_RATIO }}>
                The page you're looking cannot be found.
            </TextNormal>
            <View
                style={[
                    styles.bottomView,
                    shadowTop,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={goBack}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Go back</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
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
