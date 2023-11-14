import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '@store/hook';
import { Post } from '@type/common';
import { navigate } from '@navigation/service';

const BlogHome = () => {
    const blog = useAppSelector(state => state.posts.blogPost);

    if (!blog || blog.length == 0) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 20, marginBottom: 18, lineHeight: 26 }}>Printerval Blog</TextSemiBold>
            {blog.slice(0, 3).map(item => (
                <BlogItem key={item.id} item={item} />
            ))}
        </View>
    );
};

export default memo(BlogHome);

const BlogItem = ({ item }: { item: Post }) => {
    const toDetailBlog = () => {
        console.log(item);
        navigate('BlogScreen', { title: item.name, content: item.content }, item.id);
    };
    return (
        <Pressable style={styles.item} onPress={toDetailBlog}>
            <FastImage
                style={{ width: 112, height: 112, borderRadius: 5, backgroundColor: lightColor.graybg }}
                source={{ uri: item.image_url }}
            />
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
    itemContent: { flex: 1, paddingLeft: 10, justifyContent: 'space-between' },
    itemTitle: { fontSize: 15, lineHeight: 20, color: lightColor.primary },
    itemSubtitle: { fontSize: 13, marginTop: 6, lineHeight: 17 },

    textBottom: { fontSize: 13, color: lightColor.grayout, marginLeft: 3, lineHeight: 18 },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
