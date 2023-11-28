import HeaderScreen from '@components/HeaderScreen';
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { goBack } from '@navigation/service';
import InputNormal from '@components/input/InputNormal';
import InputOption from '@components/input/InputOption';
import { useAppDispatch, useAppSelector } from '@store/hook';
import FancyButton from '@components/FancyButton';
import { RadioText, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShippingAddress } from '@type/common';
import { useRoute } from '@react-navigation/native';
import { CreateAddressRouteProp } from '@navigation/navigationRoute';
import { useLazyFetchAddressBookQuery, usePostAddressMutation } from '@user/service';
import { showMessage } from '@components/popup/BottomMessage';
import cart from '@cart/reducer';
import { validatePhone } from '@util/index';
import { getErrorMessage } from '@api/service';

const initialValues = {
    full_name: '',
    phone: '',
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
};

const CreateAddress = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { params: { editAddress } = {} } = useRoute<CreateAddressRouteProp>();

    const countries = useAppSelector(state => state.config.countries);
    const accessToken = useAppSelector(state => state.auth.accessToken);
    const defaultAddress = useAppSelector(state => state.cart.defaultAddress);

    const [postAddress, { isLoading: l1 }] = usePostAddressMutation();
    const [fetchAddress, { isFetching: l2 }] = useLazyFetchAddressBookQuery();

    const [isDefault, setAsDefault] = useState(false);

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                full_name: yup.string().required('Enter a first name'),
                phone: yup
                    .string()
                    .required('Enter a phone')
                    .test('phone-validation', 'Invalid phone number', value => validatePhone(value)),
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
            var country = countries.find(i => i.id == input.country.id);
            var province = provinces.find(i => i.id == input.province.id);
            var msg = editAddress ? 'Address is changed' : 'New address is added';

            if (!accessToken) return;
            try {
                var res = await postAddress({
                    api_token: accessToken,
                    address: {
                        full_name: input.full_name,
                        phone: input.phone,
                        zip_code: input.zip_code,
                        country_id: country?.id || '',
                        province_id: province?.id || '',
                        city_name: input.city_name,
                        optional_address: input.optional_address,
                        address: input.address,
                        ...(editAddress && { id: editAddress.id }),
                    },
                }).unwrap();
                var res2 = await fetchAddress(accessToken).unwrap();
                //console.log(res2);

                if (!!defaultAddress && defaultAddress.id == editAddress?.id) {
                    var new_selected = res2.find(i => i.id == defaultAddress.id);
                    if (new_selected) {
                        dispatch(cart.actions.setDefaultAddress(new_selected));
                    }
                } else if (isDefault) {
                    dispatch(cart.actions.setDefaultAddress(res2[0]));
                }

                showMessage(msg);
                goBack();
            } catch (e) {
                console.log(e);
                showMessage(getErrorMessage(e));
            }
        },
    });

    const provinces = countries.find(item => item.id == values.country.id)?.provinces || [];
    const [provinceErr, setProvinceErr] = useState('');

    //lấy address từ 1 địa chỉ và fill vào form input
    const fillAddress = (item: ShippingAddress) => {
        const { full_name, phone, province, country, city_name, optional_address, zip_code, address } = item;
        setValues({
            full_name,
            phone: phone.toString(),

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
        });
    };

    useEffect(() => {
        if (editAddress) {
            fillAddress(editAddress);
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={`${editAddress ? 'Edit' : 'Add'} new address`} />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                //showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 16 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
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

                {!editAddress && (
                    <RadioText
                        selected={isDefault}
                        title={'Set as default'}
                        onPress={() => setAsDefault(!isDefault)}
                        containerStyle={{ marginTop: 16 }}
                    />
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
                <FancyButton
                    style={styles.button}
                    backgroundColor={lightColor.secondary}
                    onPress={submitForm}
                    disabled={l1 || l2}
                >
                    {l1 || l2 ? (
                        <ActivityIndicator color={'white'} size={'small'} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>
                            {editAddress ? 'Update' : 'Create'}
                        </TextSemiBold>
                    )}
                </FancyButton>
            </View>
        </View>
    );
};

export default CreateAddress;

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
