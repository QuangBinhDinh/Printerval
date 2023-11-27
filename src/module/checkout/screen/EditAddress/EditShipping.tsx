import HeaderScreen from '@components/HeaderScreen';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
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
import { ShippingAddress } from '@type/common';
import cart from '@cart/reducer';
import ModalSelectAddress, { openAddressBook } from './ModalSelectAddress';
import { validatePhone } from '@util/index';
import { useLazyFetchShippingInfoQuery } from '@checkout/service';
import { showMessage } from '@components/popup/BottomMessage';
import { getErrorMessage } from '@api/service';

const initialValues = {
    full_name: '',
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

    zip_code: '',
    delivery_note: '',
};

const validationSchema = yup.object().shape({
    full_name: yup.string().required('Enter a first name'),

    phone: yup
        .string()
        .required('Enter a phone')
        .test('phone-validation', 'Invalid phone number', value => validatePhone(value)),
    email: yup.string().required('Enter an email').email(),

    address: yup.string().required('Enter an address'),
    optional_address: yup.string(),
    city_name: yup.string().required('Enter a city/suburb'),
    // state_name: yup.string().required(),
    zip_code: yup.string().required('Enter a zip/postal code'),
    delivery_note: yup.string(),
});

const EditShipping = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const countries = useAppSelector(state => state.config.countries);
    const selectedAddress = useAppSelector(state => state.cart.defaultAddress);
    const { userInfo, token } = useAppSelector(state => state.auth);

    const [fetchShipping, { isFetching }] = useLazyFetchShippingInfoQuery();

    const { submitForm, errors, values, setFieldValue, resetForm, touched, setValues } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            if (provinces.length > 0 && input.province.id == -1) {
                setProvinceErr('Enter a state/province');
            } else {
                if (!userInfo) return;
                var country = countries.find(i => i.id == input.country.id);
                var province = provinces.find(i => i.id == input.province.id);

                var address: ShippingAddress = {
                    id: -1,
                    full_name: input.full_name,
                    phone: input.phone,
                    address: input.address,
                    optional_address: input.optional_address,
                    city_name: input.city_name,
                    zip_code: input.zip_code,
                    ...(!!country && { country, country_id: country.id }),
                    ...(!!province && { province, province_id: province.id }),
                };
                //console.log(address)
                var additional = {
                    delivery_note: input.delivery_note,
                    email: input.email,
                };

                try {
                    var res = await fetchShipping({
                        token,
                        customerId: userInfo.id,
                        location_id: country?.id || 226,
                    }).unwrap();

                    dispatch(cart.actions.setCheckoutAddress({ address, additional }));
                    goBack();
                } catch (e) {
                    showMessage(getErrorMessage(e));
                }
            }
        },
    });

    //lấy address từ 1 địa chỉ và fill vào form input
    const fillAddress = useCallback((item: ShippingAddress) => {
        const { full_name, phone, province, country, city_name, optional_address, zip_code, address } = item;
        setValues({
            full_name,
            phone: phone.toString(),
            email: userInfo?.email || '',
            country: {
                id: country?.id || 226,
                value: country?.nicename || 'United States',
            },
            province: {
                id: province?.id || -1,
                value: province?.name || '',
            },
            address,
            optional_address: optional_address || '',
            zip_code,
            city_name,
            delivery_note: '',
        });
    }, []);

    const provinces = countries.find(item => item.id == values.country.id)?.provinces || [];
    const [provinceErr, setProvinceErr] = useState('');

    useEffect(() => {
        if (selectedAddress) {
            fillAddress(selectedAddress);
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Edit shipping address"></HeaderScreen>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                //showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 24 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <Pressable style={{ marginBottom: 12 }} onPress={openAddressBook}>
                    <TextSemiBold>Fill from address book</TextSemiBold>
                </Pressable>

                <InputNormal
                    title="Full name"
                    value={values.full_name}
                    onChangeText={text => setFieldValue('full_name', text)}
                    error={errors.full_name}
                    touched={touched.full_name}
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
                <InputOption
                    title="Country/ Region"
                    value={values.country.id}
                    setValue={opt => {
                        setFieldValue('country', opt);
                        setFieldValue('province', { id: -1, value: '' });
                    }}
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
                        error={provinceErr}
                        touched={values.province.id == -1}
                    />
                )}
                <InputNormal
                    title="Zip/ Postal code"
                    value={values.zip_code}
                    onChangeText={text => setFieldValue('zip_code', text)}
                    error={errors.zip_code}
                    touched={touched.zip_code}
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
                    {isFetching ? (
                        <ActivityIndicator color={'white'} size={'small'} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Continue</TextSemiBold>
                    )}
                </FancyButton>
            </View>

            <ModalSelectAddress callback={fillAddress} />
        </View>
    );
};

export default EditShipping;

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
