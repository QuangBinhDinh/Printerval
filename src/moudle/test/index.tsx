import React, { useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';
import { useFetchCategoryBanner2Query, useFetchHomeBanner2Query } from './service';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from '@rneui/base';
import { SCREEN_WIDTH } from '@util/index';
import { SharedElement } from 'react-navigation-shared-element';
import { navigate } from '@navigation/service';
import FastImage from 'react-native-fast-image';
import { cdnImage } from '@util/cdnImage';

const SharedImage = Platform.OS == 'android' ? FastImage : Image;
const HomeScreen = () => {
    const banner = useFetchHomeBanner2Query();
    const category = useFetchCategoryBanner2Query();

    const image_list = category.data?.result?.map((i: any) => ({ url: i.image_url }));
    const firstLoad = banner.isLoading || category.isLoading;

    const [visible, setVisible] = useState(false);
    const reload = () => {
        banner.refetch();
        category.refetch();
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{ color: 'black', fontSize: 20, marginTop: 100 }}>Home Content</Text>
                {firstLoad && <ActivityIndicator style={{ marginTop: 25 }} color={'#2792ce'} size={'large'} />}

                <TouchableOpacity
                    style={{
                        backgroundColor: '#ff7300',
                        width: 240,
                        height: 0,
                        borderRadius: 8,
                        marginTop: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={reload}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>Refetch</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#ff7300',
                        width: 240,
                        height: 60,
                        borderRadius: 8,
                        marginTop: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => setVisible(true)}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>Open image</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                    {image_list?.map((item: any) => (
                        <SharedElement key={item.url} id={item.url}>
                            <Pressable style={styles.imageItem} onPress={() => navigate('Detail', { url: item.url })}>
                                <SharedImage
                                    source={{ uri: cdnImage(item.url) }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            </Pressable>
                        </SharedElement>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={visible} transparent>
                <ImageViewer imageUrls={image_list} />
                <Pressable
                    style={{ position: 'absolute', top: 40, right: 15 }}
                    hitSlop={12}
                    onPress={() => setVisible(false)}
                >
                    <Icon type="antdesign" name="close" color={'white'} size={26} />
                </Pressable>
            </Modal>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    imageItem: {
        width: SCREEN_WIDTH * 0.47,
        height: SCREEN_WIDTH * 0.47,
        marginTop: 12,
        borderRadius: 6,
        marginLeft: SCREEN_WIDTH * 0.02,
    },
});
