import HeaderScreen from '@components/HeaderScreen';
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { goBack } from '@navigation/service';
import InputNormal from '@components/input/InputNormal';
import InputOption from '@components/input/InputOption';
import { useAppDispatch, useAppSelector } from '@store/hook';
import FancyButton from '@components/FancyButton';
import { TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BillingAddress, ShippingAddress } from '@type/common';
import cart from '@cart/reducer';

const initialValues = {
    name: '',
    address: '',
    country: {
        id: -1,
        value: '',
    },
    province: {
        id: -1,
        value: '',
    },
    optional_address: '',
    city_name: '',
    zip_code: '',
};

const EditBilling = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const countries = useAppSelector(state => state.config.countries);

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                name: yup.string().required('Enter a name'),
                address: yup.string().required('Enter an address'),
                zip_code: yup.string().required('Enter a zip/postal code'),
                city_name: yup.string().required('Enter a city'),

                country: yup.object().shape({
                    id: yup.number().moreThan(-1, 'Country cannot be empty'),
                }),
                province: yup.object().when('country', {
                    is: (country: any) => {
                        var selected = countries.find(c => c.id == country.id);
                        return !!selected && selected.provinces.length > 0;
                    },
                    then: schema =>
                        schema.shape({
                            id: yup.number().moreThan(-1, 'Province cannot be empty'),
                        }),
                }),
            }),
        [],
    );

    const { submitForm, errors, values, setFieldValue, resetForm, touched, setValues } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: input => {
            var country = countries.find(i => i.id == input.country.id);
            var province = provinces.find(i => i.id == input.province.id);

            var address: BillingAddress = {
                name: input.name,
                address: input.address,
                country: country?.id || '',
                country_name: country?.name || '',
                state_name: province?.name || '',
                city_name: input.city_name,
                zip_code: input.zip_code,
                optional_address: input.optional_address,
            };

            dispatch(cart.actions.setBillAddress(address));
            goBack();
        },
    });

    const provinces = countries.find(item => item.id == values.country.id)?.provinces || [];

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Edit shipping address" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                //showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <InputNormal
                    title="Name"
                    value={values.name}
                    onChangeText={text => setFieldValue('name', text)}
                    error={errors.name}
                    touched={touched.name}
                    required
                />
                <InputOption
                    title="Country/ Region"
                    value={values.country.id}
                    placeholder="Select a country"
                    setValue={opt => {
                        setFieldValue('country', opt);
                        setFieldValue('province', { id: -1, value: '' });
                    }}
                    options={countries}
                    error={errors.country?.id}
                    touched={touched.country?.id}
                    searchable
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
                        searchable
                    />
                )}
                <InputNormal
                    title="Zip /Postal code"
                    value={values.zip_code}
                    onChangeText={text => setFieldValue('zip_code', text)}
                    error={errors.zip_code}
                    touched={touched.zip_code}
                    required
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

export default EditBilling;

const styles = StyleSheet.create({
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
