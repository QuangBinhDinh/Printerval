import React, { memo, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import EventEmitter from '../../EventEmitter';
import { StyleSheet, View } from 'react-native';
import { TextNormal, TextSemiBold } from '../text';
import { lightColor } from '@styles/color';
import { Icon } from '@rneui/base';

const EVENT_NAME = 'open_pop_up_error';
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
                <Icon
                    type="material-icon"
                    name="error-outline"
                    size={40}
                    color={lightColor.secondary}
                    style={{ marginTop: 38 }}
                />
                <TextSemiBold style={styles.title}>Error!</TextSemiBold>
                <TextNormal style={styles.content}>{title}</TextNormal>
            </View>
        </Modal>
    );
};

export default memo(PopupSuccess);

export const alertError = (content: string) => {
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
