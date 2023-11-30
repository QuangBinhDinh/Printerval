import { CameraIcon } from '@assets/svg';
import HeaderScreen from '@components/HeaderScreen';
import { useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputNormal from '@components/input/InputNormal';
import { SCREEN_WIDTH } from '@util/index';
import { CheckboxText, RadioText, TextNormal, TextSemiBold } from '@components/text';
import { normalize } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { shadowTop } from '@styles/shadow';

const initialValues = {
    full_name: '',
    gender: '',
    change_pass: false,

    old_pass: '',
    new_pass: '',
    confirm_pass: '',
};

const validationSchema = yup.object().shape({
    full_name: yup.string().required('Enter a full name'),
    old_pass: yup.string().when('change_pass', {
        is: (pass: boolean) => pass,
        then: schema => schema.required('Enter current password'),
    }),
    new_pass: yup.string().when('change_pass', {
        is: (pass: boolean) => pass,
        then: schema => schema.required('Enter new password').min(6, 'Password must have 6 letters or more'),
    }),
    confirm_pass: yup.string().when('change_pass', {
        is: (pass: boolean) => pass,
        then: schema => schema.required('Enter current password').oneOf([yup.ref('new_pass')], 'Password must match'),
    }),
});

const GENDER = [
    { id: 0, name: 'Female', value: 'FEMALE' },
    { id: 1, name: 'Male', value: 'MALE' },
    { id: 2, name: 'Rather not say', value: null },
];

const ProfileSettings = () => {
    const insets = useSafeAreaInsets();
    const { userInfo } = useAppSelector(state => state.auth);

    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: input => {},
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Profile Settings" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                removeClippedSubviews
            >
                <Pressable style={styles.avatarContainer}>
                    <FastImage style={styles.avatar} source={{ uri: userInfo?.image_url }} resizeMode="cover" />
                    <View style={styles.camera}>
                        <CameraIcon width={19} height={14} />
                    </View>
                </Pressable>

                <InputNormal
                    title="Full name"
                    value={values.full_name}
                    onChangeText={text => setFieldValue('full_name', text)}
                    error={errors.full_name}
                    touched={touched.full_name}
                    required
                />

                <TextNormal style={styles.titleInput}>Gender</TextNormal>
                <View style={styles.optionRow}>
                    {GENDER.map((item, index) => (
                        <RadioText
                            key={item.id}
                            title={item.name}
                            onPress={() => setFieldValue('gender', item.value)}
                            selected={values.gender == item.value}
                            containerStyle={{ marginLeft: index > 0 ? 24 : 4, marginTop: 8 }}
                        />
                    ))}
                </View>

                <CheckboxText
                    selected={values.change_pass}
                    onPress={() => setFieldValue('change_pass', !values.change_pass)}
                    title="Change password"
                    containerStyle={styles.checkbox}
                />

                {values.change_pass && (
                    <>
                        <InputNormal
                            title="Current password"
                            value={values.old_pass}
                            onChangeText={text => setFieldValue('old_pass', text)}
                            error={errors.old_pass}
                            touched={touched.old_pass}
                        />

                        <InputNormal
                            title="New password"
                            value={values.new_pass}
                            onChangeText={text => setFieldValue('new_pass', text)}
                            error={errors.new_pass}
                            touched={touched.new_pass}
                            required
                        />

                        <InputNormal
                            title="Confirm password"
                            value={values.confirm_pass}
                            onChangeText={text => setFieldValue('confirm_pass', text)}
                            error={errors.confirm_pass}
                            touched={touched.confirm_pass}
                        />

                        <TextNormal style={{ fontSize: 13, marginTop: 16, fontFamily: 'Poppins-Italic' }}>
                            Note: Password must be at least 6 characters
                        </TextNormal>
                    </>
                )}
                <View style={{ height: 100 }} />
            </KeyboardAwareScrollView>

            <View
                style={[
                    styles.bottomView,
                    shadowTop,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={submitForm}>
                    {false ? (
                        <ActivityIndicator color={'white'} size={'small'} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Update</TextSemiBold>
                    )}
                </FancyButton>
            </View>
        </View>
    );
};

export default ProfileSettings;

const styles = StyleSheet.create({
    avatarContainer: {
        alignSelf: 'center',
        marginTop: normalize(56),
        width: normalize(100),
        height: normalize(100),
        marginBottom: 70,
    },
    avatar: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: lightColor.graybg,
    },
    camera: {
        width: normalize(36),
        height: normalize(36),
        borderRadius: 38,
        overflow: 'hidden',
        backgroundColor: lightColor.primaryBold,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -normalize(18),
        right: 5,
    },

    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
    titleInput: {
        fontSize: 15,
        lineHeight: 19,
        color: '#999',
        marginTop: 8,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    checkbox: {
        marginVertical: 24,
        marginTop: 32,
    },

    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
