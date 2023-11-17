import { usePostImageMutation } from '@api/service';
import { TextNormal } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon } from '@rneui/base';

const MAX_IMAGES = 5;

interface IProps {
    imageUrl: string[];

    setImageUrl: any;

    screen?: string;
}
const ImageReview = ({ imageUrl, setImageUrl, screen = 'ReportProduct' }: IProps) => {
    const title =
        screen == 'ReportProduct'
            ? 'Maximum 5 images'
            : 'If you have a photo or image that will help our investigation, please add it here.';

    const [postImage] = usePostImageMutation();
    const [loading, setLoading] = useState(false);

    const deleteImage = (url: string) => {
        setImageUrl((prev: string[]) => prev.filter(item => item != url));
    };

    const openImagePicker = async () => {
        if (MAX_IMAGES == imageUrl.length) return;

        const imageRes = await ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            maxFiles: MAX_IMAGES - imageUrl.length,
        });

        const newImage = imageRes.slice(0, MAX_IMAGES - imageUrl.length).map(image => {
            const paths = image.path.split('/') || [];
            const name = image.filename || paths[paths.length - 1] || 'image.png';
            return {
                uri: image.path,
                name: name,
                type: image.mime,
                // fileName: name,
                // height: image.height,
                // width: image.width,
                // size: image.size,
            };
        });

        setLoading(true);
        try {
            const res = await Promise.all(newImage.map(img => postImage(img).unwrap()));
            const urls = res.filter(item => item.status == 'successful').map(i => i.upload[0]);
            setImageUrl((prev: string[]) => prev.concat(urls));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={{ width: '100%', marginTop: 16 }}>
            <TextNormal style={{ color: screen == 'ProductScreen' ? '#444' : '#999' }}>{title}</TextNormal>
            <View style={styles.imageRow}>
                {imageUrl.map((item, index) => (
                    <View style={[styles.image]} key={item + index}>
                        <FastImage
                            style={{ width: '100%', height: '100%', backgroundColor: lightColor.lightbg }}
                            source={{ uri: item }}
                            resizeMode="contain"
                        />
                        <Pressable hitSlop={10} style={styles.iconClose} onPress={() => deleteImage(item)}>
                            <Icon type="material-community" name="close-circle" color={'black'} size={16} />
                        </Pressable>
                    </View>
                ))}
                {imageUrl.length < MAX_IMAGES && (
                    <Pressable style={[styles.image]} onPress={openImagePicker}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color={lightColor.secondary} />
                        ) : (
                            <FastImage
                                style={styles.image1}
                                source={require('@image/add-image.png')}
                                resizeMode="contain"
                            />
                        )}
                    </Pressable>
                )}
            </View>
        </View>
    );
};

export default memo(ImageReview);

const styles = StyleSheet.create({
    imageRow: {
        minHeight: 120,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    imageView: {
        marginTop: 12,
        marginRight: 12,
        width: (SCREEN_WIDTH - 62) / 3,
        aspectRatio: 1,
        borderRadius: 6,
        //overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    imagePlaceholder: {
        marginTop: 12,
        marginRight: 12,
        width: (SCREEN_WIDTH - 62) / 3,
        height: (SCREEN_WIDTH - 62) / 3,
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        //borderWidth: 1,
    },
    image1: {
        width: 60,
        height: 60,
        zIndex: 200,
        // position: 'absolute',
        // top: 0,
        // left: 0,
    },
    iconClose: { position: 'absolute', right: -10, top: -10 },
});
