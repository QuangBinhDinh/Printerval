//UI
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SCREEN_WIDTH } from '@util/index';
import { cdnImage } from '@util/cdnImage';
import _ from 'lodash';

import { Icon } from '@rneui/base';
import FastImage from 'react-native-fast-image';

interface IProps {
    /**
     * Thông tin chi tiết của variant
     */
    item: { id: number; color_code: string; image_url: string };

    /**
     * Thay đổi màu
     * @returns
     */
    setColor: (x: any) => void;

    /**
     * Bộ ID đang được chọn
     */
    input: number[];
}

const ColorView = ({ item, setColor, input }: IProps) => {
    const selected = input.includes(item.id);
    if (!!item.image_url)
        return (
            <Pressable style={[styles.container, { borderWidth: 0.2 }]} onPress={() => setColor(item.id)}>
                <FastImage style={styles.imgColor} source={{ uri: cdnImage(item.image_url, 100, 100, true) }}>
                    {selected && (
                        <View style={[styles.innerView, { backgroundColor: 'white' }]}>
                            <FastImage
                                style={[styles.imgColor, { width: '86%', height: '86%' }]}
                                source={{ uri: cdnImage(item.image_url, 100, 100, true) }}
                            >
                                <Icon type="feather" size={26} color={'white'} name="check" />
                            </FastImage>
                        </View>
                    )}
                </FastImage>
            </Pressable>
        );
    if (item.color_code == '#ffffff')
        return (
            <Pressable style={[styles.whiteContainer]} onPress={() => setColor(item.id)}>
                {selected && (
                    <View style={[styles.innerView, { backgroundColor: 'black' }]}>
                        <View style={[styles.innerView, { backgroundColor: item.color_code }]}>
                            <Icon type="feather" size={26} color={'black'} name="check" />
                        </View>
                    </View>
                )}
            </Pressable>
        );
    return (
        <Pressable style={[styles.container, { backgroundColor: item.color_code }]} onPress={() => setColor(item.id)}>
            {selected && (
                <View style={[styles.innerView, { backgroundColor: 'white' }]}>
                    <View style={[styles.innerView, { backgroundColor: item.color_code }]}>
                        <Icon type="feather" size={26} color={'white'} name="check" />
                    </View>
                </View>
            )}
        </Pressable>
    );
};

/**
 * Hiển thị nút chọn màu
 * @returns
 */
export default memo(ColorView);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        height: 42,
        overflow: 'hidden',
        borderRadius: 60,
        marginRight: 12,

        borderWidth: 0,
    },
    whiteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        height: 42,
        overflow: 'hidden',
        borderRadius: 60,
        marginRight: 12,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#dcdcdc',
    },
    innerView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '90%',
        borderRadius: 60,
        backgroundColor: 'white',
    },
    imgColor: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
    },
});
