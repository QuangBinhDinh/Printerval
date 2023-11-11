import { TextNormal } from '@components/text';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import EventEmitter from '../../EventEmitter';
import Modal from 'react-native-modal';
import { debounce } from 'lodash';

const EVENT_NAME = 'open_message';

const DURATION = 1500;

const BottomMessage = () => {
    const [message, setMessage] = useState('Sample message');
    const [visible, setVisible] = useState(false);

    const open = (msg: string) => {
        setVisible(true);
        setMessage(msg);

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
            backdropOpacity={0}
        >
            <View
                style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#999',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 30,
                    maxWidth: SCREEN_WIDTH * 0.7,
                    zIndex: 1000,
                }}
                pointerEvents="none"
            >
                <TextNormal style={{ lineHeight: 21, color: 'white', textAlign: 'center' }}>{message}</TextNormal>
            </View>
        </Modal>
    );
};

export default memo(BottomMessage);

/**
 * Show 1 message thông báo ở phía dưới màn hình
 * @param content
 */
export const showMessage = (content: string) => {
    EventEmitter.dispatch(EVENT_NAME, content);
};
