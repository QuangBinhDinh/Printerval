import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputNormal from '@components/input/InputNormal';
import { CheckboxText, RadioText, TextSemiBold } from '@components/text';
import InputOption from '@components/input/InputOption';
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from '@store/hook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import { shadowTop } from '@styles/shadow';

const initialValues = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: {
        id: 226,
        value: 'UNITED STATES',
    },
    province: {
        id: -1,
        value: '',
    },
    address: '',
    optional_address: '',
    city_name: '',

    zipcode: '',
    delivery_note: '',

    isCustomBill: false,

    billName: '',
    billCountry: {
        id: -1,
        value: '',
    },
    billAddress: '',
    billProvince: {
        id: null,
        value: '',
    },
    billZipcode: '',
};

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Enter a first name'),
    lastName: yup.string().required('Enter a last name'),
    phone: yup.string().required('Enter a phone'),
    email: yup.string().required('Enter an email').email(),

    address: yup.string().required('Enter an address'),
    optional_address: yup.string(),
    city_name: yup.string().required('Enter a city/suburb'),
    // state_name: yup.string().required(),
    zipcode: yup.string().required('Enter a zip/postal code'),
    delivery_note: yup.string(),

    isCustomBill: yup.boolean(),

    billName: yup.string().when('isCustomBill', {
        is: (x: boolean) => !!x,
        then: schema => schema.required('Enter a name'),
    }),
    billCountry: yup.object().when('isCustomBill', {
        is: (x: boolean) => !!x,
        then: schema =>
            schema.shape({
                id: yup.number().moreThan(-1).required('Select a country'),
            }),
    }),
    billAddress: yup.string().when('isCustomBill', {
        is: (x: boolean) => !!x,
        then: schema => schema.required('Enter an address'),
    }),
    billZipcode: yup.string().when('isCustomBill', {
        is: (x: boolean) => !!x,
        then: schema => schema.required('Enter a Zip/Postal code'),
    }),
});

const AddressFill = () => {
    const countries = useAppSelector(state => state.config.countries);
    const insets = useSafeAreaInsets();
    const [isSendFriend, setSendFriend] = useState(false);

    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            console.log(input);
        },
    });

    const provinces = countries.find(item => item.id == values.country.id)?.provinces || [];

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <TextSemiBold style={styles.sectionTitle}>Billing information</TextSemiBold>
                <InputNormal
                    title="First name"
                    value={values.firstName}
                    onChangeText={text => setFieldValue('firstName', text)}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                />
                <InputNormal
                    title="Last name"
                    value={values.lastName}
                    onChangeText={text => setFieldValue('lastName', text)}
                    error={errors.lastName}
                    touched={touched.lastName}
                    required
                />
                <InputNormal
                    title="Phone"
                    value={values.phone}
                    onChangeText={text => setFieldValue('phone', text)}
                    error={errors.phone}
                    touched={touched.phone}
                    required
                    keyboardType="numeric"
                />
                <InputNormal
                    title="Email"
                    value={values.email}
                    onChangeText={text => setFieldValue('email', text)}
                    error={errors.email}
                    touched={touched.email}
                    required
                />

                <TextSemiBold style={styles.sectionTitle}>Shipping address</TextSemiBold>
                <CheckboxText
                    selected={isSendFriend}
                    onPress={() => setSendFriend(!isSendFriend)}
                    title="Send to your friend"
                    containerStyle={{ marginBottom: 8, marginTop: 0 }}
                />
                <InputOption
                    title="Country/ Region"
                    value={values.country.id}
                    setValue={opt => setFieldValue('country', opt)}
                    options={countries}
                    error={errors.country?.id}
                    touched={touched.country?.id}
                />

                <InputNormal
                    title="Address"
                    value={values.address}
                    onChangeText={text => setFieldValue('address', text)}
                    error={errors.address}
                    touched={touched.address}
                    required
                />
                <InputNormal
                    title="Apartment, suite, etc. (optional)"
                    value={values.optional_address}
                    onChangeText={text => setFieldValue('optional_address', text)}
                    error={errors.optional_address}
                    touched={touched.optional_address}
                />
                <InputNormal
                    title="City/ Suburb"
                    value={values.city_name}
                    onChangeText={text => setFieldValue('city_name', text)}
                    error={errors.city_name}
                    touched={touched.city_name}
                    required
                />
                {provinces.length > 0 && (
                    <InputOption
                        title="State/ Province"
                        value={values.province.id}
                        placeholder="Select state/province"
                        setValue={opt => setFieldValue('province', opt)}
                        options={provinces}
                        error={errors.province?.id}
                        touched={touched.province?.id}
                    />
                )}
                <InputNormal
                    title="Zip/ Postal code"
                    value={values.zipcode}
                    onChangeText={text => setFieldValue('zipcode', text)}
                    error={errors.zipcode}
                    touched={touched.zipcode}
                    required
                />
                <InputNormal
                    title="Order notes (optional)"
                    value={values.delivery_note}
                    onChangeText={text => setFieldValue('delivery_note', text)}
                    error={errors.delivery_note}
                    touched={touched.delivery_note}
                    textArea
                />
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
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Continue</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default AddressFill;

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        lineHeight: 22,
        color: '#444',
        marginTop: 16,
        marginBottom: 8,
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
