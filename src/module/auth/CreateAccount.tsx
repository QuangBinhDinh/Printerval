import React from 'react';
import { ImageBackground, Keyboard, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { appleLogin, facebookLogin, googleLogin } from './loginSocial';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { TextNormal, TextSemiBold } from '@components/text';
import { goBack } from '@navigation/service';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputDark from './component/InputDark';
import { lightColor } from '@styles/color';
import FancyButton from '@components/FancyButton';
import { SCREEN_HEIGHT } from '@util/index';
import { AppleIcon, GoogleIcon } from '@svg/index';

const RATIO = SCREEN_HEIGHT / 810;
const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPass: '',
};

const validationSchema = yup.object().shape({
    name: yup.string().required('Field cannot be empty'),
    email: yup.string().email('Email is invalid ').required('Field cannot be empty'),
    password: yup.string().required('Field cannot be empty').min(6, 'Password must have 6 letters or more'),
    confirmPass: yup
        .string()
        .required('Field cannot be empty')
        .oneOf([yup.ref('password')], 'Password must match'),
});
const CreateAccount = () => {
    const insets = useSafeAreaInsets();

    const onBack = () => {
        Keyboard.dismiss();
        goBack();
    };

    const { submitForm, errors, values, setFieldValue } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: input => {
            Keyboard.dismiss();
            console.log(input);
        },
        validateOnChange: false,
        validateOnBlur: false,
    });

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('@image/Login/login-bg-2.png')} resizeMode="cover">
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
                        <TextNormal style={styles.title}>Create{`\n`}new account</TextNormal>
                    </View>
                    <InputDark
                        value={values.name}
                        onChangeText={text => setFieldValue('name', text)}
                        error={errors.name}
                        placeholder="Your name"
                        containerStyle={{ marginTop: 8 }}
                    />
                    <InputDark
                        value={values.email}
                        onChangeText={text => setFieldValue('email', text)}
                        error={errors.email}
                        placeholder="Your email"
                        containerStyle={{ marginTop: 8 }}
                    />
                    <InputDark
                        value={values.password}
                        onChangeText={text => setFieldValue('password', text)}
                        error={errors.password}
                        placeholder="Password"
                        containerStyle={{ marginTop: 8 }}
                    />
                    <InputDark
                        value={values.confirmPass}
                        onChangeText={text => setFieldValue('confirmPass', text)}
                        error={errors.confirmPass}
                        placeholder="Confirm password"
                        containerStyle={{ marginTop: 8 }}
                    />

                    <Pressable style={styles.loginButton} onPress={submitForm}>
                        <TextSemiBold style={{ fontSize: 18 * RATIO, color: 'white' }}>SIGN UP</TextSemiBold>
                    </Pressable>

                    <TextNormal style={styles.orText}>OR</TextNormal>
                    <Pressable style={styles.socialButton}>
                        <GoogleIcon width={20} height={20} />
                        <TextNormal style={styles.socialText}>Continue with Google</TextNormal>
                    </Pressable>
                    {Platform.OS == 'ios' && (
                        <Pressable style={styles.socialButton}>
                            <AppleIcon width={20} height={20} />
                            <TextNormal style={styles.socialText}>Continue with Apple</TextNormal>
                        </Pressable>
                    )}

                    <TextNormal style={[styles.bottomText, { bottom: 16 + insets.bottom / 1.5 }]}>
                        Already have an account?{' '}
                        <TextSemiBold style={{ color: lightColor.secondary }} onPress={onBack}>
                            Login
                        </TextSemiBold>
                    </TextNormal>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

export default CreateAccount;

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
    },
    title: {
        fontSize: 32 * RATIO,
        lineHeight: 40 * RATIO,
        color: 'white',
    },
    loginButton: {
        marginTop: 10 * RATIO,
        width: '100%',
        height: 46 * RATIO,
        borderRadius: 46,
        backgroundColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotText: {
        fontSize: 15,
        color: lightColor.grayout,
        marginTop: 18 * RATIO,
        lineHeight: 18,
        alignSelf: 'center',
    },
    orText: {
        fontSize: 15,
        color: lightColor.grayout,
        alignSelf: 'center',
        lineHeight: 18,
        marginTop: 20 * RATIO,
    },
    socialButton: {
        marginTop: 12,
        width: '100%',
        height: 46 * RATIO,
        borderRadius: 46,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialText: { fontSize: 15, marginLeft: 8, marginTop: 2 },
    bottomText: { fontSize: 15, color: 'white', alignSelf: 'center', position: 'absolute' },
});
