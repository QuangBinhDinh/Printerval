import { goBack } from '@navigation/service';
import { useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { cdnImage } from '@util/cdnImage';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { Platform } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SharedElement } from 'react-navigation-shared-element';

const SharedImage = Platform.OS == 'android' ? FastImage : Image;
const DetailScreen = () => {
    const route = useRoute();

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Pressable style={styles.iconBack} onPress={goBack}>
                <Icon type="ant-design" size={22} color={'black'} name="arrowleft" />
            </Pressable>
            <SharedElement id={route.params?.url}>
                <SharedImage
                    resizeMode="cover"
                    style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH, marginBottom: 80 }}
                    source={{ uri: cdnImage(route.params?.url) }}
                />
            </SharedElement>
            <Text style={{ fontSize: 20 }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
            </Text>
        </View>
    );
};

export default DetailScreen;

const styles = StyleSheet.create({
    iconBack: {
        position: 'absolute',
        top: 40,
        left: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 25,
        zIndex: 150,
    },
});
