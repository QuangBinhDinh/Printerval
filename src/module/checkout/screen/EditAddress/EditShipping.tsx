import HeaderScreen from '@components/HeaderScreen';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { goBack } from '@navigation/service';
import InputNormal from '@components/input/InputNormal';
import InputOption from '@components/input/InputOption';
import { useAppDispatch, useAppSelector } from '@store/hook';
import FancyButton from '@components/FancyButton';
import { CheckboxText, TextSemiBold } from '@components/text';
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
    first_name: '',
    last_name: '',
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

    recipient_name: '',
    recipient_phone: '',
};

const EditShipping = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const countries = useAppSelector(state => state.config.countries);
    const selectedAddress = useAppSelector(state => state.cart.defaultAddress);
    const { email } = useAppSelector(state => state.cart.additionalInfo);
    const giftInfo = useAppSelector(state => state.cart.giftInfo);
    const { userInfo, token } = useAppSelector(state => state.auth);

    const [fetchShipping, { isFetching }] = useLazyFetchShippingInfoQuery();

    const [isSendFriend, setSendFriend] = useState(false);

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                first_name: yup.string().required('Enter a first name'),
                last_name: yup.string().required('Enter a last name'),
                phone: yup
                    .string()
                    .required('Enter a phone')
                    .test('phone-validation', 'Invalid phone number', value => validatePhone(value)),
                email: yup.string().required('Enter an email').email(),
                address: yup.string().required('Enter an address'),
                optional_address: yup.string(),
                city_name: yup.string().required('Enter a city/suburb'),

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

                zip_code: yup.string().required('Enter a zip/postal code'),
                delivery_note: yup.string(),
            }),
        [],
    );

    const { submitForm, errors, values, setFieldValue, resetForm, touched, setValues } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            if (!userInfo) return;
            var country = countries.find(i => i.id == input.country.id);
            var province = provinces.find(i => i.id == input.province.id);
            var full_name = input.first_name + input.last_name;

            var address: ShippingAddress = {
                id: -1,
                full_name,
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

                dispatch(
                    cart.actions.setCheckoutAddress({
                        address,
                        additional,
                        ...(isSendFriend && { giftInfo: { name: input.recipient_name, phone: input.recipient_phone } }),
                    }),
                );
                goBack();
            } catch (e) {
                showMessage(getErrorMessage(e));
            }
        },
    });

    //lấy address từ 1 địa chỉ và fill vào form input
    const fillAddress = useCallback((item: ShippingAddress, giftInfo: { name: string; phone: string }) => {
        const { full_name, phone, province, country, city_name, optional_address, zip_code, address } = item;

        const [first, last] = full_name.split(' ');
        setValues({
            first_name: first,
            last_name: last || '',
            phone: phone.toString(),
            email,
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
            recipient_name: giftInfo.name,
            recipient_phone: giftInfo.phone,
        });
    }, []);

    const provinces = countries.find(item => item.id == values.country.id)?.provinces || [];

    useEffect(() => {
        if (selectedAddress) {
            fillAddress(selectedAddress, giftInfo);
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
                    title="First name"
                    value={values.first_name}
                    onChangeText={text => setFieldValue('first_name', text)}
                    error={errors.first_name}
                    touched={touched.first_name}
                    required
                />
                <InputNormal
                    title="Last name"
                    value={values.last_name}
                    onChangeText={text => setFieldValue('last_name', text)}
                    error={errors.last_name}
                    touched={touched.last_name}
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
                <CheckboxText
                    selected={isSendFriend}
                    onPress={() => setSendFriend(!isSendFriend)}
                    title="Send to your friend"
                    containerStyle={{ marginBottom: 8, marginTop: 0 }}
                />
                {isSendFriend && (
                    <>
                        <InputNormal
                            title="Recipient's full name"
                            value={values.recipient_name}
                            onChangeText={text => setFieldValue('recipient_name', text)}
                            error={errors.recipient_name}
                            touched={touched.recipient_name}
                        />
                        <InputNormal
                            title="Recipient's phone"
                            value={values.recipient_phone}
                            onChangeText={text => setFieldValue('recipient_phone', text)}
                            error={errors.recipient_phone}
                            touched={touched.recipient_phone}
                            keyboardType="numeric"
                        />
                    </>
                )}

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
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Update</TextSemiBold>
                    )}
                </FancyButton>
            </View>

            <ModalSelectAddress
                callback={address => {
                    fillAddress(address, { name: values.recipient_name, phone: values.recipient_phone });
                }}
            />
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
