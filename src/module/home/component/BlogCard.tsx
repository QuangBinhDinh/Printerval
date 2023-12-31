import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '@store/hook';
import { Post } from '@type/common';
import { navigate } from '@navigation/service';

const BlogCard = ({ item }: { item: Post }) => {
    const imageUnavailable = !item.image_url.includes('https');

    const toDetailBlog = () => {
        navigate('BlogScreen', { post: item }, item.id);
    };
    return (
        <Pressable style={styles.item} onPress={toDetailBlog}>
            {imageUnavailable ? (
                <Image style={styles.img} source={require('@image/image-blog-default.jpg')} />
            ) : (
                <FastImage style={styles.img} source={{ uri: item.image_url }} />
            )}
            <View style={styles.itemContent}>
                <View>
                    <TextNormal style={styles.itemTitle} numberOfLines={2}>
                        {item.name}
                    </TextNormal>
                    <TextNormal style={styles.itemSubtitle} numberOfLines={2}>
                        {item.description}
                    </TextNormal>
                </View>
                <View style={styles.bottom}>
                    <Icon type="antdesign" name="folder1" size={16} color={lightColor.grayout} />
                    <TextNormal style={styles.textBottom}>Gifts Ideas & Advice</TextNormal>
                </View>
            </View>
        </Pressable>
    );
};

export default memo(BlogCard);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 16,
    },
    item: {
        width: '100%',
        height: 112,
        marginBottom: 24,
        flexDirection: 'row',
    },
    img: { width: 112, height: 112, borderRadius: 5, backgroundColor: lightColor.graybg },
    itemContent: { flex: 1, paddingLeft: 10, justifyContent: 'space-between' },
    itemTitle: { fontSize: 15, lineHeight: 20, color: lightColor.primary },
    itemSubtitle: { fontSize: 13, marginTop: 6, lineHeight: 17 },

    textBottom: { fontSize: 13, color: lightColor.grayout, marginLeft: 3, lineHeight: 18 },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
