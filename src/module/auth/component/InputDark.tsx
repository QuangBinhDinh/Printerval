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
};
const InputDark = ({
    containerStyle,
    errorStyle,
    value,
    onChangeText,
    error,
    touched,
    placeholder,
    secureTextEntry = false,
    ...rest
}: InputProps) => {
    const [hidePass, setHidePass] = useState(secureTextEntry);
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.inputView, !!error && touched && { borderBottomColor: lightColor.error }]}>
                <TextInput
                    style={styles.inputStyle}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={lightColor.grayout}
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

export default memo(InputDark);

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        marginTop: 30 * RATIO,
        // borderWidth: 1,
        // borderColor: 'white',
    },
    inputView: {
        flexDirection: 'row',
        height: 36,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: lightColor.grayout,
        alignItems: 'center',
        paddingRight: 4,
    },
    inputStyle: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        height: 36,
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'white',
        padding: 0,
    },
    error: {
        fontSize: 13,
        color: lightColor.error,
        marginTop: 4,
    },
});
