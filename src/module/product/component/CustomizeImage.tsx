import { DynamicObject } from '@type/base';
import { ErrorField } from '@type/product';
import React, { memo, useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { TextSemiBold, TextNormal } from '@components/text';
import { capitalize } from 'lodash';
import { lightColor } from '@styles/color';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { usePostImageMutation } from '@api/service';
import { Icon } from '@rneui/base';

interface IProps {
    imageConfig: DynamicObject[];

    setConfig: (field: string, value: any) => void;

    errors: ErrorField | null;
}

const CustomizeImage = ({ imageConfig, setConfig, errors }: IProps) => {
    const [images, setImages] = useState<{ name: string; slug: string; image_url: string }[]>(imageConfig);
    const [loading, setLoading] = useState<boolean[]>(imageConfig.map(i => false));

    const deleteImage = (slug: string) => {
        setImages(prev => prev.map(item => (item.slug == slug ? { ...item, image_url: '' } : item)));
    };

    const [postImage] = usePostImageMutation();

    const pickImage = async (slug: string, fieldName: string, index: number) => {
        const imageRes = await ImagePicker.openPicker({
            mediaType: 'photo',
        });
        const paths = imageRes.path.split('/') || [];
        const name = imageRes.filename || paths[paths.length - 1] || 'image.png';

        const imageData = {
            uri: imageRes.path,
            name,
            type: imageRes.mime,
        };
        setLoading(prev => prev.map((item, i) => (i == index ? true : item)));

        try {
            const res = await postImage(imageData).unwrap();
            if (res.status == 'successful') {
                setImages(prev => prev.map(item => (item.slug == slug ? { ...item, image_url: res.upload[0] } : item)));
                setConfig(fieldName, { type: 'image', value: res.upload[0] });
            }
        } catch (e) {
        } finally {
            setLoading(prev => prev.map((item, i) => (i == index ? false : item)));
        }
    };

    return (
        <View style={{ width: '100%' }}>
            {images.map((item, index) => {
                var isError = errors?.type == 'custom_image';
                return (
                    <View style={styles.optionView} key={item.name}>
                        <TextSemiBold style={styles.optionTitle}>
                            {capitalize(item.name)}
                            <TextSemiBold style={{ color: lightColor.error }}>*</TextSemiBold>
                        </TextSemiBold>

                        <Pressable style={styles.image} onPress={() => pickImage(item.slug, item.name, index)}>
                            {loading[index] ? (
                                <ActivityIndicator color={lightColor.secondary} size="small" />
                            ) : item.image_url ? (
                                <>
                                    <FastImage
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: lightColor.lightbg,
                                        }}
                                        resizeMode="contain"
                                        source={{ uri: item.image_url }}
                                    />
                                    <Pressable style={styles.iconClose} hitSlop={10}>
                                        <Icon type="material-community" name="close-circle" color={'black'} size={16} />
                                    </Pressable>
                                </>
                            ) : (
                                <Image
                                    style={{ width: '100%', height: '100%' }}
                                    source={require('@image/add-image.png')}
                                    resizeMode="contain"
                                />
                            )}
                        </Pressable>
                        {isError && !item.image_url && (
                            <TextNormal style={styles.errorText}>Select an image</TextNormal>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default memo(CustomizeImage);

const styles = StyleSheet.create({
    optionView: {
        width: '100%',
        marginTop: 16,
        paddingLeft: 18,
    },
    optionTitle: { fontSize: 15, color: 'black', lineHeight: 21 },
    optionRow: {
        width: '100%',
        marginTop: 4,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        //borderWidth: 1,
    },
    errorText: {
        fontSize: 13,
        color: lightColor.error,

        marginTop: 8,
        lineHeight: 15,
    },
    iconClose: { position: 'absolute', right: -8, top: -8 },
});
