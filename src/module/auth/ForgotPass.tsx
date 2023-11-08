import React from 'react';
import { ImageBackground, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { TextNormal, TextSemiBold } from '@components/text';
import { goBack, navigate } from '@navigation/service';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputDark from './component/InputDark';
import { lightColor } from '@styles/color';
import { SCREEN_HEIGHT } from '@util/index';

const RATIO = SCREEN_HEIGHT / 810;
const initialValues = {
    email: '',
};

const validationSchema = yup.object().shape({
    email: yup.string().email('Email is invalid ').required('Field cannot be empty'),
});
const ForgotPass = () => {
    const insets = useSafeAreaInsets();

    const onBack = () => {
        Keyboard.dismiss();
        goBack();
    };

    const { submitForm, errors, values, setFieldValue, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: input => {
            Keyboard.dismiss();
            // console.log(input);
            navigate('EnterNewPass');
        },
        validateOnChange: false,
        validateOnBlur: false,
    });

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('@image/Login/login-bg-3.png')} resizeMode="cover">
                <LinearGradient
                    style={[styles.container, { paddingTop: insets.top / 1.5 }]}
                    colors={['rgba(0,0,0,0.85)', 'rgba(3,3,3,0.51)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <Pressable style={styles.iconBack} onPress={onBack} hitSlop={12}>
                        <Icon size={30} type="antdesign" name="arrowleft" color="white" />
                    </Pressable>
                    <View style={styles.viewTitle} onTouchEnd={Keyboard.dismiss}>
                        <TextNormal style={styles.title}>Forgot Password</TextNormal>
                        <TextNormal style={styles.subtitle}>We will send you an one-time verification code</TextNormal>
                    </View>

                    <InputDark
                        value={values.email}
                        onChangeText={text => setFieldValue('email', text)}
                        error={errors.email}
                        touched={touched.email}
                        placeholder="Enter your email"
                    />

                    <Pressable style={styles.loginButton} onPress={submitForm}>
                        <TextSemiBold style={{ fontSize: 18 * RATIO, color: 'white' }}>RESET PASSWORD</TextSemiBold>
                    </Pressable>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

export default ForgotPass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
    },
    iconBack: {
        marginTop: 10,
        marginLeft: -6,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewTitle: {
        width: '100%',
        paddingTop: 30 * RATIO,
        paddingBottom: 15 * RATIO,
    },
    title: {
        fontSize: 32 * RATIO,
        lineHeight: 40 * RATIO,
        color: 'white',
    },
    loginButton: {
        marginTop: 20 * RATIO,
        width: '100%',
        height: 46 * RATIO,
        borderRadius: 46,
        backgroundColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: lightColor.grayout,
        marginTop: 24,
        lineHeight: 18,
    },
});
