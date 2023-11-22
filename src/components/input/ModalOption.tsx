import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { DESIGN_RATIO, SCREEN_WIDTH } from '@util/index';
import { debounce } from 'lodash';
import React, { useState, memo, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import EventEmitter from '../../EventEmitter';
import { lightColor } from '@styles/color';

const EVENT_NAME = 'open_option_modal';

export interface Option {
    id: string | number;
    value: string;
}

interface OptionArgs {
    data: Option[];

    callback: (item: Option) => void;

    selectedId: string | number;

    title?: string;
}

const ModalOption = () => {
    const [visible, setVisible] = useState(false);

    const [state, setState] = useState<OptionArgs>({
        data: [],
        callback: () => {},
        selectedId: '',
        title: 'Select an option',
    });
    const { data, callback, selectedId, title } = state;

    const scrollHeight = 66 * DESIGN_RATIO * Math.min(8, data.length) + 14;
    const open = (args: OptionArgs) => {
        setState(args);
        setVisible(true);
    };

    const submit = (item: Option) => {
        setState(prev => ({ ...prev, selectedId: item.id }));
        // console.log('Select item', item);
        if (callback) callback(item);
        debounce(() => {
            setVisible(false);
        }, 250)();
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
            backdropOpacity={0.2}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', width: '100%', marginTop: 24 }}>
                    <TextSemiBold style={{ color: 'black', fontSize: 15 }}>{title}</TextSemiBold>
                </View>

                <ScrollView
                    style={{ width: '100%', height: scrollHeight }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    removeClippedSubviews
                >
                    <View style={{ height: 10 }} />
                    {data.map((item, index) => (
                        <Pressable
                            style={[styles.sectionView, index == data.length - 1 && { borderBottomWidth: 0 }]}
                            key={item.id}
                            onPress={() => submit(item)}
                        >
                            <TextNormal>{item.value}</TextNormal>
                            {selectedId == item.id && (
                                <Icon type="antdesign" name="check" size={20} color={lightColor.secondary} />
                            )}
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default memo(ModalOption);

/**
 * Mở option modal với các tham số truyền vào trong param
 * @param arg
 *
 * data: Danh sách các option
 *
 * callback: Hàm callback để lấy item được select
 *
 * selectedId: Id của item đang được select
 *
 */
export const openModalOption = (arg: OptionArgs) => {
    EventEmitter.dispatch(EVENT_NAME, arg);
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 18,

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'white',
    },
    sectionView: {
        width: '100%',
        height: 66 * DESIGN_RATIO,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 200,
    },
});
