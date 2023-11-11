import React, { useEffect } from 'react';
import HeaderScreen from '@components/HeaderScreen';
import { RadioText, TextNormal, TextSemiBold } from '@components/text';
import { ReportProductRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { lightColor } from '@styles/color';
import { cdnImage } from '@util/cdnImage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import he from 'he';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputBold from '@components/input/InputBold';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { shadowTop } from '@styles/shadow';
import { usePostProductReportMutation } from '@product/service';
import { ProductReportArgs } from '@product/service/type';
import { alertSuccess } from '@components/popup/PopupSuccess';
import { alertError } from '@components/popup/PopupError';
import { goBack } from '@navigation/service';
import { useAppSelector } from '@store/hook';
import { showMessage } from '@components/popup/BottomMessage';

const OPTION = [
    { id: 'violates_trademark', name: 'It violates a trademark' },
    { id: 'violates_community', name: 'It violates our community standards' },
    { id: 'unsuitable_for_kid', name: "It's unsuitable for kids products" },
    { id: 'report_other', name: 'Other' },
];

const initialValues = {
    email: '',
    reportType: {
        id: 'violates_trademark',
        name: '',
    },
    name: '',
    content: '',
};

const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    content: yup.string().required('Content required'),
    name: yup.string().required('Your name required'),
    reportType: yup.object().shape({
        id: yup.string().required('Report type required'),
    }),
});

const ReportProduct = () => {
    const {
        params: { product },
    } = useRoute<ReportProductRouteProp>();
    const insets = useSafeAreaInsets();

    const [postReport, { isLoading }] = usePostProductReportMutation();
    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            var body: ProductReportArgs = {
                product_id: product.id,
                content: input.content,
                email: input.email,
                report: input.reportType.id,
                name: input.name,
            };
            try {
                const res = await postReport(body).unwrap();
                if (res.status == 'successful') {
                    alertSuccess('Your report is sent');
                    goBack();
                }
            } catch (e) {
                showMessage('Something went wrong');
            }
        },
    });

    const userInfo = useAppSelector(state => state.auth.userInfo);
    useEffect(() => {
        if (userInfo?.email) {
            setFieldValue('email', userInfo.email);
        }
    }, [userInfo]);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Report Product" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <View style={styles.productContainer}>
                    <FastImage style={styles.productImg} source={{ uri: cdnImage(product.image_url, 630, 630) }} />
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <TextNormal style={{ fontSize: 13, lineHeight: 16, color: lightColor.primary }}>
                            {he.decode(product.name)}
                        </TextNormal>
                        <TextNormal style={styles.price}>
                            {product.display_price}{' '}
                            <TextNormal style={styles.oldPrice}>{product.display_high_price}</TextNormal>
                        </TextNormal>
                    </View>
                </View>

                <TextSemiBold style={styles.sectionTitle}>Why do you want to report this content?</TextSemiBold>
                {OPTION.map(item => (
                    <RadioText
                        title={item.name}
                        key={item.id}
                        onPress={() => setFieldValue('reportType', item)}
                        selected={values.reportType.id == item.id}
                    />
                ))}

                <TextSemiBold style={styles.sectionTitle}>
                    If the content does not meet these guidelines, please provide any additional comments or
                    information.
                </TextSemiBold>
                <InputBold
                    title="Enter Your Email"
                    value={values.email}
                    onChangeText={text => setFieldValue('email', text)}
                    error={errors.email}
                    touched={touched.email}
                />
                <InputBold
                    title="Enter Your Name"
                    value={values.name}
                    onChangeText={text => setFieldValue('name', text)}
                    error={errors.name}
                    touched={touched.name}
                />
                <InputBold
                    title="Content"
                    value={values.content}
                    onChangeText={text => setFieldValue('content', text)}
                    error={errors.content}
                    touched={touched.content}
                    textArea
                />
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

export default ReportProduct;
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
        lineHeight: 21,
        marginBottom: 8,
    },
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
});
