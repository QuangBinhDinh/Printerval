import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputNormal from '@components/input/InputNormal';
import { CheckboxText, TextSemiBold } from '@components/text';
import InputOption from '@components/input/InputOption';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import { shadowTop } from '@styles/shadow';
import { navigate, goBack } from '@navigation/service';
import { ShippingAddress } from '@type/common';
import cart from '@cart/reducer';
import { usePostAddressMutation } from '@user/service';
import { validatePhone } from '@util/index';
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

const AddressFill = () => {
    const countries = useAppSelector(state => state.config.countries);
    const accessToken = useAppSelector(state => state.auth.accessToken);

    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const [postAddress] = usePostAddressMutation();

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

    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            var country = countries.find(i => i.id == input.country.id);
            var province = provinces.find(i => i.id == input.province.id);
            var full_name = input.first_name + ' ' + input.last_name;

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

            var additional = {
                delivery_note: input.delivery_note,
                email: input.email,
            };

            navigate('CheckoutPreview');
            dispatch(
                cart.actions.setCheckoutAddress({
                    address,
                    additional,
                    ...(isSendFriend && { giftInfo: { name: input.recipient_name, phone: input.recipient_phone } }),
                }),
            );

            try {
                postAddress({
                    address: {
                        full_name: address.full_name,
                        phone: address.phone,
                        zip_code: address.zip_code,
                        country_id: address.country_id || '',
                        province_id: address.province_id || '',
                        city_name: address.city_name,
                        optional_address: address.optional_address,
                        address: address.address,
                    },
                    api_token: accessToken || '',
                });
            } catch (e) {
                console.log(e);
                showMessage(getErrorMessage(e));
            }
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

                <TextSemiBold style={styles.sectionTitle}>Shipping address</TextSemiBold>
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
                    setValue={opt => setFieldValue('country', opt)}
                    options={countries}
                    error={errors.country?.id}
                    touched={touched.country?.id}
                    required
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
                        required
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
