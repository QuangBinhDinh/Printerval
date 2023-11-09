import { TextNormal } from '@components/text';
import { Icon } from '@rneui/base';
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
    ...rest
}: InputProps) => {
    const [hidePass, setHidePass] = useState(secureTextEntry);
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.inputView, !!error && touched && { borderColor: lightColor.error }]}>
                <TextInput
                    style={styles.inputStyle}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={title}
                    placeholderTextColor={!!error && touched ? lightColor.error : lightColor.grayout}
                    secureTextEntry={hidePass}
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
            {!!error && touched && <TextNormal style={[styles.error, errorStyle]}>{error}</TextNormal>}
        </View>
    );
};

export default memo(InputBold);

const styles = StyleSheet.create({
    container: {
        height: 70,
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
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        height: 36,
        flex: 1,
        color: '#444',
        // borderWidth: 1,
        // borderColor: 'white',
        padding: 0,
    },
    error: {
        fontSize: 11,
        lineHeight: 13,
        color: lightColor.error,
        marginTop: 2,
        marginLeft: 6,
    },
});
