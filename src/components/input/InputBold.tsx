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
};
const InputBold = ({
    containerStyle,
    errorStyle,
    value,
    onChangeText,
    error,
    touched,
    title,
    secureTextEntry = false,
    textArea,
    areaHeight = 120,
    ...rest
}: InputProps) => {
    const [hidePass, setHidePass] = useState(secureTextEntry);
    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[
                    styles.inputView,
                    !!error && touched && { borderColor: lightColor.error },
                    textArea && { height: areaHeight },
                ]}
            >
                <TextInput
                    style={[styles.inputStyle, textArea && { textAlignVertical: 'top', paddingTop: 10 }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={title}
                    placeholderTextColor={!!error && touched ? lightColor.error : lightColor.grayout}
                    secureTextEntry={hidePass}
                    multiline={textArea}
                    {...rest}
                />
                {secureTextEntry && (
                    <Icon
                        type="entypo"
                        name={hidePass ? 'eye' : 'eye-with-line'}
                        size={22}
                        color="white"
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

export default memo(InputBold);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 8,
    },
    inputView: {
        flexDirection: 'row',
        height: 52,
        width: '100%',
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        backgroundColor: lightColor.lightbg,
        alignItems: 'center',
        paddingLeft: 10,
        borderRadius: 6,
        overflow: 'hidden',
    },
    inputStyle: {
        fontSize: normalize(15),
        fontFamily: 'Poppins-Regular',
        flex: 1,
        height: '100%',
        color: '#444',
        padding: 0,
        // borderWidth: 1,
    },
    error: {
        fontSize: 11,
        lineHeight: 13,
        color: lightColor.error,
        marginTop: 2,
        marginLeft: 6,
    },
});
