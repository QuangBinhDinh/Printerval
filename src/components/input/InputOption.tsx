import React, { memo, useState } from 'react';
import { Pressable, StyleProp, TextInputProps, TextStyle, ViewStyle, StyleSheet, TextInput, View } from 'react-native';
import { TextNormal } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { SCREEN_HEIGHT } from '@util/index';
import { Option, openModalOption } from './ModalOption';

const RATIO = SCREEN_HEIGHT / 810;

interface IProps {
    containerStyle?: StyleProp<ViewStyle>;

    errorStyle?: StyleProp<TextStyle>;

    error: string | undefined;

    touched: boolean | undefined;

    title: string;

    placeholder?: string;

    required?: boolean;

    /**
     * Id item đang được select
     */
    value: string | number;

    /**
     * Gán giá trị Id đang được select
     */
    setValue: (obj: Option) => void;

    /**
     * List các option
     */
    options: {
        id: string | number;
        value: string;
    }[];
}
const InputOption = ({
    containerStyle,
    errorStyle,
    value,
    setValue,
    error,
    touched,
    required,
    title,
    placeholder = 'Select an option',
    options,
}: IProps) => {
    const openModal = () => {
        openModalOption({
            data: options,
            callback: item => setValue(item),
            title: placeholder,
            selectedId: value,
        });
    };

    const textValue = options.find(i => i.id == value)?.value;

    return (
        <View style={[styles.container, containerStyle]}>
            <TextNormal style={styles.titleStyle}>
                {title}
                {required && <TextNormal style={{ color: lightColor.price }}> *</TextNormal>}
            </TextNormal>
            <Pressable
                style={[styles.inputView, !!error && touched && { borderColor: lightColor.error }]}
                onPress={openModal}
            >
                <TextNormal style={[styles.inputStyle, !textValue && { color: '#999' }]}>
                    {textValue || `--${placeholder}--`}
                </TextNormal>
                <Icon type="feather" name={'chevron-down'} size={22} color="#999" />
            </Pressable>
            <View style={{ height: 18 }}>
                {!!error && touched && <TextNormal style={[styles.error, errorStyle]}>{error}</TextNormal>}
            </View>
        </View>
    );
};

export default memo(InputOption);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 8,
    },
    titleStyle: {
        fontSize: 15,
        lineHeight: 19,
        color: '#999',
    },
    inputView: {
        flexDirection: 'row',
        height: 36,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#D6D6D6',

        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 4,
    },
    inputStyle: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
        flex: 1,
        color: '#444',
    },
    error: {
        fontSize: 11,
        lineHeight: 13,
        color: lightColor.error,
        marginTop: 2,
    },
});
