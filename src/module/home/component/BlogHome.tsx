import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '@store/hook';
import { Post } from '@type/common';
import { navigate } from '@navigation/service';
import BlogCard from './BlogCard';

const BlogHome = () => {
    const blog = useAppSelector(state => state.posts.blogPost);

    if (!blog || blog.length == 0) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={{ fontSize: 20, marginBottom: 18, lineHeight: 26 }}>Printerval Blog</TextSemiBold>
            {blog.slice(0, 3).map(item => (
                <BlogCard key={item.id} item={item} />
            ))}
        </View>
    );
};

export default memo(BlogHome);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 16,
    },
});
