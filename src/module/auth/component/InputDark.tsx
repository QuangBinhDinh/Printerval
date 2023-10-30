import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_HEIGHT } from '@util/index';
import React, { memo } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';

const RATIO = SCREEN_HEIGHT / 810;

interface IProps {
    containerStyle?: StyleProp<ViewStyle>;

    errorStyle?: StyleProp<TextStyle>;

    value: string;

    onChangeText: (text: string) => void;

    error: string | undefined;

    placeholder: string;
}
const InputDark = ({ containerStyle, errorStyle, value, onChangeText, error, placeholder }: IProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.inputStyle, !!error && { borderBottomColor: lightColor.error }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={lightColor.grayout}
            />
            {!!error && <TextNormal style={[styles.error, errorStyle]}>{error}</TextNormal>}
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
    inputStyle: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'Poppins-Regular',
        height: 36,
        borderBottomWidth: 1,
        borderBottomColor: lightColor.grayout,
        padding: 0,
    },
    error: {
        fontSize: 13,
        color: lightColor.error,
        marginTop: 4,
    },
});
