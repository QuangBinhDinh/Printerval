import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import EventEmiiter from '../../../EventEmiiter';

const LoginError = () => {
    const [msg, setMsg] = useState('');
    const [visible, setVisible] = useState(false);
    const showError = (err: string) => {
        setMsg(err);
        setVisible(true);
    };
    const hideError = () => {
        setMsg('');
        setVisible(false);
    };

    useEffect(() => {
        EventEmiiter.addListener('showLoginError', showError);
        return () => {
            EventEmiiter.removeListener('showLoginError', showError);
        };
    }, []);

    return (
        <Modal
            useNativeDriverForBackdrop
            useNativeDriver
            hideModalContentWhileAnimating
            isVisible={visible}
            onBackdropPress={hideError}
            onBackButtonPress={hideError}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={styles.container}>
                <Icon type="material-community" name="emoticon-sad-outline" size={50} color={lightColor.yellowstar} />
                <TextSemiBold style={styles.title}>Something went wrong</TextSemiBold>
                <TextNormal style={styles.content}>{msg}</TextNormal>
                <Pressable style={styles.button} onPress={hideError}>
                    <TextSemiBold style={{ color: 'white' }}>OK</TextSemiBold>
                </Pressable>
            </View>
        </Modal>
    );
};

export default memo(LoginError);

export const showLoginError = (err: string) => {
    EventEmiiter.dispatch('showLoginError', err);
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 23,
        width: 280,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    title: {
        color: lightColor.yellowstar,
        fontSize: 20,
        marginTop: 16,
        fontFamily: 'Inter-SemiBold',
    },
    content: {
        fontSize: 15,
        lineHeight: 20,
        marginTop: 10,
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 35,
        marginTop: 16,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
    },
});
