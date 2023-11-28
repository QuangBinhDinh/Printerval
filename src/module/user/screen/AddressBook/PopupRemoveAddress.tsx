import React, { memo, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SuccessIcon } from '@assets/svg';
import { debounce } from 'lodash';
import { Icon } from '@rneui/base';
import EventEmitter from '../../../../EventEmitter';

const EVENT_NAME = 'ask_remove_address';

const PopupRemoveAddress = () => {
    const [visible, setVisible] = useState(false);
    const [callback, setCallback] = useState({
        func: () => {},
    });

    const open = (callback: any) => {
        setVisible(true);
        setCallback({ func: callback });
    };

    const onSubmit = () => {
        callback.func();
        setVisible(false);
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
                    type="antdesign"
                    name="warning"
                    color={lightColor.yellowstar}
                    size={36}
                    style={{ marginTop: 24 }}
                />
                <TextNormal style={styles.content}>{'Do you want to remove this address?'}</TextNormal>

                <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={() => setVisible(false)}>
                        <TextSemiBold style={{ fontSize: 15, marginTop: 2, color: lightColor.secondary }}>
                            No
                        </TextSemiBold>
                    </Pressable>
                    <Pressable style={styles.buttonFocus} onPress={onSubmit}>
                        <TextSemiBold style={{ fontSize: 15, marginTop: 2, color: 'white' }}>Yes</TextSemiBold>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default memo(PopupRemoveAddress);

export const askBeforeRemove = (callback: any) => {
    EventEmitter.dispatch(EVENT_NAME, callback);
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: 280,
        height: 206,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 20,
        color: lightColor.secondary,
        lineHeight: 24,
        marginTop: 24,
    },
    content: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        width: '90%',
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        width: '48%',
        height: 36,
        borderRadius: 6,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFocus: {
        width: '48%',
        height: 36,
        borderRadius: 6,
        backgroundColor: lightColor.secondary,
        borderWidth: 1,
        borderColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
