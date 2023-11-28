import React, { memo, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import EventEmitter from '../../EventEmitter';
import { StyleSheet, View } from 'react-native';
import { TextNormal, TextSemiBold } from '../text';
import { lightColor } from '@styles/color';
import { Icon } from '@rneui/base';
import { debounce } from 'lodash';
import { normalize } from '@rneui/themed';

const EVENT_NAME = 'open_pop_up_error';
const DURATION = 2250;

const PopupSuccess = () => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('Some text here');

    const open = (text: string) => {
        setVisible(true);
        setTitle(text);

        debounce(() => setVisible(false), DURATION)();
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
                    size={normalize(40)}
                    color={lightColor.secondary}
                    style={{ marginTop: 16 }}
                />
                <TextSemiBold style={styles.title}>Error</TextSemiBold>
                <TextNormal style={styles.content}>{title.slice(0, 100)}</TextNormal>
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
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: lightColor.secondary,
        lineHeight: 24,
        marginTop: 20,
    },
    content: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        width: '90%',
    },
});
