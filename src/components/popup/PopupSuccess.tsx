import React, { memo, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import EventEmitter from '../../EventEmitter';
import { StyleSheet, View } from 'react-native';
import { TextNormal, TextSemiBold } from '../text';
import { lightColor } from '@styles/color';
import { SuccessIcon } from '@assets/svg';

const EVENT_NAME = 'open_pop_up_success';
const PopupSuccess = () => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('Some text here');

    const open = (text: string) => {
        setVisible(true);
        setTitle(text);
    };

    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, open);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, open);
        };
    }, []);
    return (
        <Modal
            useNativeDriverForBackdrop
            useNativeDriver
            hideModalContentWhileAnimating
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            onBackButtonPress={() => setVisible(false)}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            backdropOpacity={0.2}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View style={styles.container}>
                <SuccessIcon width={40} height={40} style={{ marginTop: 38 }} />
                <TextSemiBold style={styles.title}>Success!</TextSemiBold>
                <TextNormal style={styles.content}>{title}</TextNormal>
            </View>
        </Modal>
    );
};

export default memo(PopupSuccess);

export const alertSuccess = (content: string) => {
    EventEmitter.dispatch(EVENT_NAME, content);
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: 280,
        height: 206,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: lightColor.secondary,
        lineHeight: 24,
        marginTop: 24,
    },
    content: {
        marginTop: 26,
        fontSize: 16,
        textAlign: 'center',
        width: '90%',
    },
});
