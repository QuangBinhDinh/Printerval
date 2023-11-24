import { TextNormal } from '@components/text';
import { Icon } from '@rneui/base';
import { normalize } from '@rneui/themed';
import { lightColor } from '@styles/color';
import { SCREEN_HEIGHT } from '@util/index';
import React, { memo, useState } from 'react';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';

const RATIO = SCREEN_HEIGHT / 810;

type InputProps = TextInputProps & {
    containerStyle?: StyleProp<ViewStyle>;

    errorStyle?: StyleProp<TextStyle>;

    error: string | undefined;

    touched: boolean | undefined;

    title: string;

    /**
     * Có phải text area không
     */
    textArea?: boolean;

    /**
     * Chiều cao text area
     */
    areaHeight?: number;

    required?: boolean;
};
const InputNormal = ({
    containerStyle,
    errorStyle,
    value,
    onChangeText,
    error,
    touched,
    placeholder,
    secureTextEntry = false,
    textArea,
    areaHeight = 100,
    required,
    title,
    ...rest
}: InputProps) => {
    const [hidePass, setHidePass] = useState(secureTextEntry);
    return (
        <View style={[styles.container, containerStyle]}>
            <TextNormal style={styles.titleStyle}>
                {title}
                {required && <TextNormal style={{ color: lightColor.price }}> *</TextNormal>}
            </TextNormal>
            <View
                style={[
                    styles.inputView,
                    !!error && touched && { borderColor: lightColor.error },
                    textArea && { height: areaHeight },
                ]}
            >
                <TextInput
                    style={[styles.inputStyle, textArea && { textAlignVertical: 'top' }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={lightColor.grayout}
                    secureTextEntry={hidePass}
                    multiline={textArea}
                    {...rest}
                />
                {secureTextEntry && (
                    <Icon
                        type="entypo"
                        name={hidePass ? 'eye' : 'eye-with-line'}
                        size={22}
                        color="#999"
                        onPress={() => setHidePass(!hidePass)}
                    />
                )}
            </View>
            <View style={{ height: 18 }}>
                {!!error && touched && <TextNormal style={[styles.error, errorStyle]}>{error}</TextNormal>}
            </View>
        </View>
    );
};

export default memo(InputNormal);

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
        paddingRight: 4,
    },
    inputStyle: {
        fontSize: normalize(15),
        fontFamily: 'Poppins-Regular',
        height: '100%',
        flex: 1,
        color: '#444',
        padding: 0,
        paddingTop: 4,
    },
    error: {
        fontSize: 11,
        lineHeight: 13,
        color: lightColor.error,
        marginTop: 4,
    },
});
