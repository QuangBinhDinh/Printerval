import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SCREEN_WIDTH } from '@util/index';
import HeaderScreen from '@components/HeaderScreen';
import { TextSemiBold } from '@components/text';
import { View, StyleSheet, Keyboard, Pressable, ActivityIndicator } from 'react-native';
import * as yup from 'yup';
import { useFormik } from 'formik';
import InputBold from '@components/input/InputBold';
import { lightColor } from '@styles/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadowTop } from '@styles/shadow';
import FancyButton from '@components/FancyButton';
import { CreateReviewRouteProp } from '@navigation/navigationRoute';
import { useAppSelector } from '@store/hook';
import { Icon } from '@rneui/base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProductReviewArgs } from '@product/service/type';
import { usePostProductReviewMutation } from '@product/service';
import { alertSuccess } from '@components/popup/PopupSuccess';
import { goBack } from '@navigation/service';
import InvisibleLoad from '@components/loading/InvisibleLoad';
import { alertError } from '@components/popup/PopupError';
import ImageReview from '@product/component/ImageReview';
import { showMessage } from '@components/popup/BottomMessage';

const initialValues = {
    name: '',
    email: '',
    title: '',
    content: '',
};
const validationSchema = yup.object().shape({
    email: yup.string().email('Email is invalid ').required('Field cannot be empty'),
    name: yup.string().required('Field cannot be empty'),
    title: yup.string().required('Field cannot be empty'),
    content: yup.string().required('Field cannot be empty'),
});

const CreateReview = () => {
    const insets = useSafeAreaInsets();
    const {
        params: { product_id },
    } = useRoute<CreateReviewRouteProp>();
    const userInfo = useAppSelector(state => state.auth.userInfo);

    const [postReview, { isLoading }] = usePostProductReviewMutation();

    const [rating, setRating] = useState(5);
    const [imageUrl, setImageUrl] = useState<string[]>([]);

    const { submitForm, errors, values, setFieldValue, resetForm, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async input => {
            Keyboard.dismiss();
            var body: ProductReviewArgs = {
                full_name: input.name,
                email: input.email,
                title: input.title,
                content: input.content,
                rating,
                status: 'PENDING',
                target_id: product_id,
            };
            if (imageUrl.length > 0) body.images = JSON.stringify(imageUrl);
            try {
                const res = await postReview(body).unwrap();
                if (res.status == 'successful') {
                    alertSuccess('Your review is sent');
                    goBack();
                }
            } catch (e) {
                console.log(e);
                showMessage('Something went wrong');
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
            <HeaderScreen title=" Write a customer review" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, alignItems: 'center' }}
                enableOnAndroid
                enableResetScrollToCoords={false}
            >
                <TextSemiBold style={{ fontSize: 16, color: '#444', marginTop: 24 }}>Overall Rating</TextSemiBold>
                {/* <StarRating starSize={40} width={250} style={{ marginTop: 16 }} rating={rating} /> */}
                <View style={styles.starRating}>
                    {[1, 2, 3, 4, 5].map(item => (
                        <Pressable hitSlop={8} onPress={() => setRating(item)} key={item}>
                            <Icon
                                type="font-awesome"
                                name="star"
                                size={44}
                                color={item <= rating ? lightColor.yellowstar : '#999'}
                            />
                        </Pressable>
                    ))}
                </View>
                <TextSemiBold style={{ fontSize: 16, color: '#444', marginTop: 28, marginBottom: 16 }}>
                    Write a customer review
                </TextSemiBold>

                <InputBold
                    title="Enter Your Name"
                    value={values.name}
                    onChangeText={text => setFieldValue('name', text)}
                    error={errors.name}
                    touched={touched.name}
                />
                <InputBold
                    title="Enter Your Email"
                    value={values.email}
                    onChangeText={text => setFieldValue('email', text)}
                    error={errors.email}
                    touched={touched.email}
                />
                <InputBold
                    title="Title"
                    value={values.title}
                    onChangeText={text => setFieldValue('title', text)}
                    error={errors.title}
                    touched={touched.title}
                />
                <InputBold
                    title="Content"
                    value={values.content}
                    onChangeText={text => setFieldValue('content', text)}
                    error={errors.content}
                    touched={touched.content}
                    textArea
                />
                <ImageReview imageUrl={imageUrl} setImageUrl={setImageUrl} />
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

export default CreateReview;

const styles = StyleSheet.create({
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
    starRating: {
        flexDirection: 'row',
        width: 320,
        justifyContent: 'space-evenly',
        marginTop: 16,
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
