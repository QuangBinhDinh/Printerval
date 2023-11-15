import React, { useEffect, useState } from 'react';
import HeaderScreen from '@components/HeaderScreen';
import { RadioText, TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputBold from '@components/input/InputBold';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { shadowTop } from '@styles/shadow';
import { usePostTicketMutation } from '@product/service';
import { TicketSendArgs } from '@product/service/type';
import { useAppSelector } from '@store/hook';
import { showMessage } from '@components/popup/BottomMessage';
import md5 from 'md5';
import moment from 'moment';
import { alertSuccess } from '@components/popup/PopupSuccess';
import { goBack } from '@navigation/service';
import ImageReview from '@product/component/ImageReview';
import InvisibleLoad from '@components/loading/InvisibleLoad';
import InputNormal from '@components/input/InputNormal';
import InputOption from '@components/input/InputOption';

const ticketTypes = [
    { id: 'order', value: 'Order' },
    { id: 'change_order', value: 'Change Order Info' },
    { id: 'tracking_code', value: 'Track Order' },
    { id: 'claim_paypal', value: 'Claim Paypal' },
    { id: 'unhappy_customer', value: 'Unhappy Customers' },
    { id: 'issue_report', value: 'Issue Report' },
    { id: 'complaint', value: 'Other' },
    { id: 'cancel_order', value: 'Cancel/Refund Order' },
];
const ticketTypesRequiredOrderCode = [
    'order',
    'cancel_order',
    'change_order',
    'tracking_code',
    'claim_paypal',
    'unhappy_customer',
];

const initialValues = {
    email: '',
    custome_name: '',
    title: '',
    ticketType: '',
    content: '',
    order_code: '',
};

const validationSchema = yup.object().shape({
    title: yup.string().required('Field cannot be empty'),
    ticketType: yup.string().required('Field cannot be empty'),
    content: yup.string().required('Content required'),
    email: yup.string().email().required('Field cannot be empty'),
    custome_name: yup.string().required('Field cannot be empty'),
    order_code: yup.string().when('ticketType', {
        is: (tic: string) => ticketTypesRequiredOrderCode.includes(tic),
        then: schema => schema.required('Field cannot be empty'),
    }),
});

const CreateTicket = () => {
    // const {
    //     params: { product },
    // } = useRoute<ReportProductRouteProp>();
    const insets = useSafeAreaInsets();

    const { userInfo, token } = useAppSelector(state => state.auth);
    const [postTicket, { isLoading }] = usePostTicketMutation();

    const [images, setImages] = useState<string[]>([]);
    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            var body: TicketSendArgs = {
                token_customer: token,
                title: input.title,
                email: input.email,
                content: input.content,
                status: 'open',
                type: input.ticketType,
                customer_name: input.custome_name,
                order_code: input.order_code,

                token_ticket: md5(moment().format()),
                ...(images.length > 0 && { files: JSON.stringify(images) }),
            };
            //console.log(body);
            try {
                const res = await postTicket(body).unwrap();
                if (res.status == 'successful') {
                    alertSuccess('Your ticket is created');
                    goBack();
                }
            } catch (e: any) {
                var msg = JSON.stringify(e.message?.content) || JSON.stringify(e.message) || JSON.stringify(e);
                showMessage(msg);
            }
        },
    });

    useEffect(() => {
        if (userInfo?.email) {
            setFieldValue('email', userInfo.email);
        }
    }, [userInfo]);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <InvisibleLoad visible={isLoading} />
            <HeaderScreen title="Create a ticket" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <View style={{ height: 20 }} />
                <InputNormal
                    title="Your email"
                    value={values.email}
                    onChangeText={text => setFieldValue('email', text)}
                    error={errors.email}
                    touched={touched.email}
                    required
                />
                <InputNormal
                    title="Your Name"
                    value={values.custome_name}
                    onChangeText={text => setFieldValue('custome_name', text)}
                    error={errors.custome_name}
                    touched={touched.custome_name}
                    required
                />
                <InputNormal
                    title="Subject"
                    value={values.title}
                    onChangeText={text => setFieldValue('title', text)}
                    error={errors.title}
                    touched={touched.title}
                    required
                />

                <InputOption
                    title="Ticket type"
                    value={values.ticketType}
                    setValue={setFieldValue}
                    options={ticketTypes}
                    error={errors.ticketType}
                    touched={touched.ticketType}
                    required
                />

                {ticketTypesRequiredOrderCode.includes(values.ticketType) && (
                    <InputNormal
                        title="Order Code"
                        value={values.order_code}
                        onChangeText={text => setFieldValue('order_code', text)}
                        error={errors.order_code}
                        touched={touched.order_code}
                        required
                    />
                )}

                <InputNormal
                    title="How can we help you?"
                    value={values.content}
                    onChangeText={text => setFieldValue('content', text)}
                    error={errors.content}
                    touched={touched.content}
                    required
                    textArea
                />
                <ImageReview imageUrl={images} setImageUrl={setImages} screen="CreateTicket" />
                <View style={{ height: 80 }} />
            </KeyboardAwareScrollView>

            <View
                style={[
                    styles.bottomView,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                    shadowTop,
                ]}
            >
                <FancyButton
                    style={styles.submitButton}
                    backgroundColor={lightColor.secondary}
                    onPress={submitForm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Submit</TextSemiBold>
                    )}
                </FancyButton>
            </View>
        </View>
    );
};

export default CreateTicket;
const styles = StyleSheet.create({
    productContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    productImg: {
        width: 120,
        height: 120,
        borderRadius: 5,
        overflow: 'hidden',
    },
    price: {
        color: lightColor.price,
        fontSize: 15,
        marginTop: 2,
    },
    oldPrice: { fontSize: 13, color: lightColor.grayout, textDecorationLine: 'line-through' },
    sectionTitle: {
        fontSize: 16,
        color: 'black',
        marginTop: 16,
        lineHeight: 23,
    },
    optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, marginTop: 6 },

    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    submitButton: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
    error: {
        fontSize: 11,
        lineHeight: 13,
        color: lightColor.error,
    },
});
